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
// Get a chat room by his room_code
router.get('/rooms/:code', (req, res, next) => {
  const {code} = req.params;

  ChatRoom.findOne({code: code}).then(room => {
    if (!room) res.status(404).end();
    res.json(room);
  }).catch(error => next(error));
});

router.put('/rooms/:id', (req, res, next) => {
  const { id } = req.params;
  const room = req.body;

  const newRoomInfo = {
    only_invitations: room.only_invitations,
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
      only_invitations: room.only_invitations ?? undefined,
      users: [{ username: room.host }],
      messages: []
    });
    newRoom.save().then(savedRoom => {
      res.json(savedRoom);
    }).catch(error => next(error))
  }
});

router.delete('/rooms/:id', (req, res, next) => {
  const { id } = req.params;

  if (isValidObjectId(id)) {
    ChatRoom.findByIdAndDelete(id).then(result => {
      res.status(204).end();
    }).catch(error => next(error));
  }
  else res.status(400).end();
});

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
  }).catch(error => next(error))
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
    console.log(invalidReason)
  }
})
module.exports = router;