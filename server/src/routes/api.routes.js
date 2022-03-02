const { Router } = require('express');
const { isValidObjectId } = require('mongoose');
const router = Router();
const ChatRoom = require('../models/ChatRoom');

// home
router.get('/', (req, res) => {
  res.send(`
    <h1>〰closed-mind home〰</h1>
  `);
});

// Get all current sessions
router.get('/sessions', (req, res) => {
  ChatRoom.find({}).then(sessions => {
    res.json(sessions);
  });
});
// Ger a session by id
router.get('/sessions/:id', (req, res, next) => {
  const { id } = req.params;

  if (isValidObjectId(id)) {
    ChatRoom.findById(id).then(session => {
      if (!session) res.status(404).end();
      res.json(session);
    }).catch(error => next(error));
  }
  else res.status(400).end();
});

router.put('/sessions/:id', (req, res) => {
  const { id } = req.params;
  const session = req.body;

  const newSessionInfo = {
    is_open: session.is_open,
    users: session.users,
    messages: session.messages
  };
  ChatRoom.findByIdAndUpdate(id, newSessionInfo, {new: true}).then(updatedSession => {
    res.json(updatedSession);
  }).catch(error => next(error));
})
router.put('/sessions/:id/messages/', (req, res) => {
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
  }, {new: true}).then(updatedSession => {
    res.json(updatedSession);
  }).catch(error => next(error));
})

router.post('/sessions', (req, res) => {

  const session = req.body;
  if (!session) res.status(400).end();
  else {
    const newSession = new Session({
      code: session.code,
      host: session.host,
      created_date: new Date(),
      is_open: true,
      users: [{ username: session.host }],
      messages: []
    });
    newSession.save().then(savedSession => {
      res.json(savedSession);
    })
  }
});

router.delete('/sessions/:id', (req, res) => {
  const { id } = req.params;

  if (isValidObjectId(id)) {
    ChatRoom.findByIdAndDelete(id).then(result => {
      res.status(204).end();
    }).catch(error => next(error));
  }
  else res.status(400).end();
});

module.exports = router;