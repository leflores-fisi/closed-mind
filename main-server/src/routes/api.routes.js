const { Router }          = require('express');
const { isValidObjectId } = require('mongoose');

const ChatRoom         = require('../models/ChatRoom');
const RoomInvitation   = require('../models/RoomInvitation');
const validateUsername = require('../helpers/validateUser');
const generateInvitationCode = require('../helpers/generateInvitationCode');
const router = Router();

// home
router.get('/', (req, res) => {
  res.send(`
    <h1>〰closed-mind home〰</h1>
  `);
});

// Get all current rooms
router.get('/rooms', (req, res) => {
  ChatRoom.find({}).then(rooms => {
    res.json(rooms);
  });
});

router.get('/room_info/:code', (req, res) => {
  const { code } = req.params.code;
  if (!code || code.length !== 5 || code[0] !== '#') {
    res.status(400).send({
      message: 'Bad request, room code must have the format #xxxx'
    })
  }
  else {
    ChatRoom.find({ code: code }).then(roomFound => {
      res.json({
        name: room.name,
        users_online: room.users.length,
        code: room.code,
        host: room.host
      });
    })
  }
})
// Get all public rooms
router.get('/public_rooms/:index?', (req, res) => {
  let { index } = req.params;
  if (!index || index < 0) index = 0;
  
  ChatRoom.find({ privacy: 'public'})
    .sort({ usersOnline: -1, messagesCount: -1, _id: 1 })
    .skip(6 * index)
    .limit(6)
    .then(publicRooms => {
      res.json({
        results: publicRooms.map(room => ({
          name: room.name,
          users_online: room.users.length,
          code: room.code,
          host: room.host
        })),
        total: publicRooms.length
      });
    })
})
// Get a chat room by his room_code
router.get('/rooms/:id', (req, res, next) => {
  const {id} = req.params;

  ChatRoom.findById(id).then(room => {
    if (!room) res.status(404).end();
    else res.json(room);
  }).catch(error => next(error));
});

router.put('/rooms/:id', (req, res, next) => {
  const { id } = req.params;
  const room = req.body;

  const newRoomInfo = {
    privacy: room.privacy,
    users: room.users,
    messages: room.messages
  };
  ChatRoom.findByIdAndUpdate(id, newRoomInfo, {new: true}).then(updatedRoom => {
    res.json(updatedRoom);
  }).catch(error => next(error));
})
router.put('/rooms/:id/messages/', (req, res, next) => {
  const { id } = req.params;
  const newMessage = req.body;
  const {username, message} = newMessage;
  ChatRoom.findByIdAndUpdate(id, {
    "$push": {
      "messages": {
        username: username,
        message: message,
        date: new Date()
      }
    }
  }, {new: true}).then(updatedRoom => {
    res.json(updatedRoom);
  }).catch(error => next(error));
})

router.post('/rooms', (req, res, next) => {

  const room = req.body;
  if (!room) res.status(400).end();
  else {
    const newRoom = new ChatRoom({
      code: room.code,
      host: room.host,
      created_date: new Date(),
      privacy: room.privacy ?? 'public',
      users: [{ username: room.host }],
      messages: []
    });
    newRoom.save().then(savedRoom => {
      res.json(savedRoom);
    }).catch(error => next(error))
  }
});

router.delete('/rooms', (req, res, next) => {
  ChatRoom.deleteMany({}).then(deleteInformation => {
    res.json(deleteInformation);
  }).catch(error => next(error))
})
router.delete('/rooms/:id', (req, res, next) => {
  const { id } = req.params;

  if (isValidObjectId(id)) {
    ChatRoom.findByIdAndDelete(id).then(result => {
      res.status(204).end();
    }).catch(error => next(error));
  }
  else res.status(400).end();
});
router.patch('/rooms/:code/edit-config', (req, res, next) => {

  const config = req.body;
  const room_code = req.params.code;

  ChatRoom.findOneAndUpdate({code: room_code}, {
    privacy: config.privacy
  }, {new: true})
  .then(updatedRoom => {
    if (!updatedRoom) {
      res.status(404).end();
      return;
    }
    res.status(200).end();
  }).catch(error => next(error))
});

// Room invitations 🐢

router.get('/invitations', (req, res, next) => {
  RoomInvitation.find({}).then(roomInvitations => {
    res.send(roomInvitations);
  })
})
router.post('/invitations', (req, res, next) => {

  const invitation = req.body;
  if (!invitation) res.status(400).end();
  else {
    const newInvitation = new RoomInvitation({
      invitation_code: generateInvitationCode(),
      room_code: invitation.room_code,
      room_name: invitation.room_name,
      host: invitation.host,
      description: invitation.description,
    });
    newInvitation.save().then(savedInvitation => {
      res.json(savedInvitation);
    }).catch(error => next(error))
  }
})
router.get('/invitations/:code', (req, res, next) => {
  const {code} = req.params;

  RoomInvitation.findOne({invitation_code: code}).then(invitation => {
    if (!invitation) res.send(404).end();
    else res.json(invitation);
  }).catch(error => next(error))
})
router.delete('/invitations', (req, res, next) => {

  RoomInvitation.deleteMany({}).then(deleteInformation => {
    res.json(deleteInformation);
  }).catch(error => next(error));
})
router.delete('/invitations/:code', (req, res, next) => {
  const {code} = req.params;

  RoomInvitation.findOneAndDelete({invitation_code: code}).then(deletedInvitation => {
    if (!deletedInvitation) res.send(404).end();
    else res.json(deletedInvitation);
  }).catch(error => next(error))
})

// Username validation
router.post('/username_validation', (req, res) => {

  const {username} = req.body;

  if (validateUsername(username) === 'OK')
    res.status(200).send('OK');
  else {
    let invalidReason = validateUsername(username);
    res.status(422).send({reason: invalidReason});
  }
})
module.exports = router;