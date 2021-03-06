require('dotenv').config();
require('./mongo');

const express    = require('express');
const { Server } = require('socket.io');
const http       = require('http');
const cors       = require('cors');

const ChatRoom   = require('./models/ChatRoom');
const apiRoutes  = require('./routes/api.routes');

const generateRoomCode = require('./helpers/generateRoomCode');
const { nanoid } = require('nanoid');

const PORT = Number(process.env.PORT) || 8001;

function main() {
  const app = express();
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'production' ? 'https://closedmind.vercel.app' : 'http://localhost:3000',
      credentials: true,
    }
  });

  app.use(cors());
  app.use(express.json());
  app.use(express.static(__dirname+'/../public/'));

  app.use((req, res, next) => {
    console.log(`Request '${req.method}' received at ${req.url}`);
    next();
  });
  app.use(apiRoutes);


  io.on('connection', (socket) => {
    console.log('\n🐢 [New socket connection]');
    console.log(' Sockets:', io.allSockets())

    socket.on('creating-chat-room', ({ room_name, host }) => {

      const room_code = generateRoomCode();

      const newChatRoom = new ChatRoom({
        host: host,
        name: room_name,
        code: room_code,
        privacy: 'public',
        created_date: new Date().toUTCString(),
        usersOnline: 1,
        messagesCount: 0,
        users: [
          {user_id: host.user_id, user_color: host.user_color}
        ],
        messages: [{
          from: '@senders/SERVER',
          text: `${host.user_id} created ${room_code}!!`,
          date: new Date().toUTCString(),
          message_id: nanoid(),
          reactions: []
        }]
      });
      newChatRoom.save().then(createdChatRoom => {
        socket.join(room_code);
        socket.currentRoomCode = room_code;
        socket.currentUser = host;
        console.log('\n🗣 New room created:', room_name, 'with code', room_code)
        socket.emit('room-created', {createdChatRoom})
      })
    })
    socket.on('joining-to-chat', ({ room_code, user, fromPublicList }) => {

      console.log('😖 Fetching room to database');
      console.time('fetching');

      ChatRoom.findOne({code: room_code}).then((room) => {
        if (!room) {
          socket.emit('joining-error', {
            message: 'Room not founded'
          });
          console.log('😐 Not founded');
          console.timeEnd('fetching');
        }
        else if (room.privacy === 'private' && fromPublicList) {
          socket.emit('joining-error', {
            message: `${room.name} is not public anymore`
          });
          console.log('😐 Room is private');
          console.timeEnd('fetching');
        }
        else {
          let date = new Date().toUTCString();
          let server_log = {
            from: '@senders/SERVER',
            text: `${user.user_id} has joined to the chat`,
            date: date,
            message_id: nanoid(),
            reactions: []
          }
          ChatRoom.findOneAndUpdate({code: room_code}, {
            $push: {
              users: {
                user_id: user.user_id,
                user_color: user.user_color
              },
              messages: server_log
            },
            $inc: {
              usersOnline: +1
            }
          }, {new: true}).then(joinedChatRoom => {
            console.log('😐 Fetched');
            console.timeLog('fetching')
            socket.join(room_code);
            socket.emit('joined', {joinedChatRoom});
            socket.broadcast.to(room_code).emit('user-connected', {user, server_log});
            socket.currentRoomCode = room_code;
            socket.currentUser = user;
            console.log(`🐌 <${joinedChatRoom.code}> ${user.user_id} joined`);
            console.log('🙂 Joined');
            console.timeEnd('fetching');
          }).catch(error => console.error('Error on socket->join:', error));
        }
      })
      // else res.status(400).end(); Handle this
    })
    socket.on('sending-message', ({ date, message, message_id, replyingTo, attachments }) => {
      ChatRoom.findOneAndUpdate({ code: socket.currentRoomCode }, {
        $push: {
          messages: {
            from: socket.currentUser.user_id,
            color: socket.currentUser.user_color,
            text: message,
            date: date,
            message_id: message_id,
            replyingTo: replyingTo,
            reactions: [],
            attachments: attachments
          }
        },
        $inc: {
          messagesCount: +1
        }
      }, {new: true}).then(updatedChatRoom => {
        console.log(`🐌 <${socket.currentRoomCode}> ${socket.currentUser.user_id} says: ${message} with id ${message_id}`);
        // Emitting the event for all the sockets in its room, except itself
        socket.broadcast.to(socket.currentRoomCode).emit('message-received', {
          date,
          user: socket.currentUser,
          message,
          message_id,
          replyingTo,
          attachments
        });
        io.to(socket.id).emit('message-sent');
      }).catch(error => console.log('Error on socket->message', error));
    })
    socket.on('new-reaction-to-message', ({ message_id, emote }) => {
      console.log('REACTION TO:', message_id);
      ChatRoom.findOneAndUpdate(
        {
          code: socket.currentRoomCode,
          messages: {
            $elemMatch: {
              message_id: message_id
            }
          }
        },
        {
          $push: {
            "messages.$.reactions": {
              emote: emote,
              users_list: [socket.currentUser.user_id]
            }
          }
        }, {new: true}).then(updatedChatRoom => {
          console.log(`🐌 <${socket.currentRoomCode}> NEW REACTION from ${socket.currentUser.user_id} with ${emote} to ${message_id}`);
          socket.broadcast.to(socket.currentRoomCode).emit('message-reacted', { message_id, emote, from: socket.currentUser.user_id });
        })
    })
    socket.on('reacting-to-message', ({ message_id, emote }) => {
      ChatRoom.findOneAndUpdate(
        {
          code: socket.currentRoomCode,
          messages: {
            $elemMatch: {
              message_id: message_id
            }
          }
        },
        {
          $push: {
            "messages.$.reactions.$[reaction].users_list": socket.currentUser.user_id
          }
        },
        {
          arrayFilters: [
            {"reaction.emote": emote}
          ],
          new: true
      }).then(updatedChatRoom => {
        console.log(`🐌 <${socket.currentRoomCode}> ${socket.currentUser.user_id} reacts with ${emote} to ${message_id}`);
        socket.broadcast.to(socket.currentRoomCode).emit('message-reacted', { message_id, emote, from: socket.currentUser.user_id });

      }).catch(error => console.log('Error on socket->react-to-message', error));
    })
    socket.on('decreasing-reaction', ({ message_id, emote }) => {
      ChatRoom.findOneAndUpdate(
        {
          code: socket.currentRoomCode,
          messages: {
            $elemMatch: {
              message_id: message_id
            }
          }
        },
        {
          $pull: {
            "messages.$.reactions.$[reaction].users_list": socket.currentUser.user_id
          }
        },
        {
          arrayFilters: [
            {"reaction.emote": emote}
          ],
          new: true
      }).then(updatedChatRoom => {
        console.log(`🐌 <${socket.currentRoomCode}> ${socket.currentUser.user_id} DECREASING their ${emote} from ${message_id}`);
        socket.broadcast.to(socket.currentRoomCode).emit('decreased-message-reaction', { message_id, emote, from: socket.currentUser.user_id });

      }).catch(error => console.log('Error on socket->decreasing-reaction-from-message', error));
    })
    socket.on('deleting-reaction-from-message', ({ message_id, emote }) => {
      ChatRoom.findOneAndUpdate(
        {
          code: socket.currentRoomCode,
          messages: {
            $elemMatch: {
              message_id: message_id
            }
          }
        },
        {
          $pull: {
            "messages.$.reactions": {
              emote: emote
            }
          }
        }).then(updatedChatRoom => {
        console.log(`🐌 <${socket.currentRoomCode}> ${socket.currentUser.user_id} REMOVING their ${emote} from ${message_id}`);
        io.to(socket.currentRoomCode).emit('deleted-message-reaction', { message_id, emote, from: socket.currentUser.user_id });

      }).catch(error => console.log('Error on socket->remove-reaction-from-message', error));
    })
    socket.on('banning-user', ({user_id, reason}) => {
      let date = new Date().toUTCString();
      let server_log = {
        from: '@senders/SERVER',
        text: `Goodbye! ${user_id} has been banned${reason ? ` Reason: ${reason}` : ''}`,
        date: date,
        message_id: nanoid(),
        reactions: []
      };
      ChatRoom.findOneAndUpdate({code: socket.currentRoomCode}, {
        $pull: {
          users: {user_id: user_id}
        },
        $push: {
          messages: server_log
        },
        $inc: {
          usersOnline: -1
        }
      }, {new: true})
        .then(updatedChatRoom => {
          return io.to(updatedChatRoom.code).fetchSockets()
        })
        .then(roomSockets => {
          for (let userSocket of roomSockets) {
            if (userSocket.currentUser.user_id === user_id) {
              io.to(socket.currentRoomCode).emit('user-disconnected', {user_id, server_log});
              userSocket.emit('disconnected-from-room', user_id);
              userSocket.leave(socket.currentRoomCode);
              console.log(`🐌 <${socket.currentRoomCode}> ${user_id} has been banned (->banning)`);
              userSocket.currentRoomCode = '';
            }
          }
        });
    })
    socket.on('leaving-from-chat', ({farewell}) => {
      let date = new Date().toUTCString()
      let server_log = {
        from: '@senders/SERVER',
        text: `${socket.currentUser.user_id} has disconnected` + (farewell ? ` saying: ${farewell}` : ''),
        date: date,
        message_id: nanoid(),
        reactions: []
      }
      ChatRoom.findOneAndUpdate({code: socket.currentRoomCode}, {
        $pull: {
          users: {user_id: socket.currentUser.user_id}
        },
        $push: {
          messages: server_log
        },
        $inc: {
          usersOnline: -1
        }
      }, {new: true}).then(updatedChatRoom => {

        socket.leave(socket.currentRoomCode);
        io.to(socket.currentRoomCode).emit('user-disconnected', {user_id: socket.currentUser.user_id, server_log});
        socket.emit('disconnected-from-room', socket.currentUser.user_id);
        console.log(`🐌 <${updatedChatRoom.code}> ${socket.currentUser.user_id} has disconnected (->leaving)`);
        socket.currentRoomCode = '';

      }).catch(error => console.log('Error on socket->leave', error));
    })
    socket.on('ping', (timestamp) => {
      let server_log = {
        from: '@senders/APP_INFO',
        text: `Ping: `,
        date: Date.now()
      }
      socket.emit('pong', {timestamp, server_log});
    })
    socket.on('typing-message', () => {
      socket.broadcast.to(socket.currentRoomCode).emit('user-typing', socket.currentUser?.user_id);
    })

    socket.on('disconnect', () => {
      console.log('\n🐢 [Socket disconnection]');
      console.log(' Sockets:', io.allSockets());
      
      if (socket.currentRoomCode) {
        let date = new Date().toUTCString();
        let server_log = {
          from: '@senders/SERVER',
          text: `${socket.currentUser.user_id} has disconnected`,
          date: date,
          message_id: nanoid(),
          reactions: []
        }
        ChatRoom.findOneAndUpdate({code: socket.currentRoomCode}, {
          $pull: {
            users: {user_id: socket.currentUser.user_id}
          },
          $push: {
            messages: server_log
          },
          $inc: {
            usersOnline: -1
          }
        }, {new: true}).then(updatedRoom => {
          socket.leave(socket.currentRoomCode);
          io.to(socket.currentRoomCode).emit('user-disconnected', {
            user_id: socket.currentUser.user_id,
            server_log
          });
          // socket.emit('disconnected-from-room', user_id); ?
          // (NO, because the socket has disconnected, so the event will never come
          //  unless the socket connects again, which could lead to bugs)
          console.log(`🐌 <${socket.currentRoomCode}> ${socket.currentUser.user_id} has disconnected (->disconnect)`);
          socket.currentRoomCode = '';
        }).catch(error => console.log('Error on socket->disconnect', error));
      }
      socket.disconnect();
    })
    io.engine.on('connection_error', (err) => {
      console.log('ENGINE ERROR', err)
    })
  })

  // No path found
  app.use((req, res) => {
    res.status(404).end();
  });
  app.use((error, req, res, next) => {
    console.log('Final middleware reached:', error.name);
    res.status(400).send({error: error.name}).end();
  });

  httpServer.listen(PORT, () => {
    console.log('Server running on port', PORT);
  });
}
if (require.main === module) main();
