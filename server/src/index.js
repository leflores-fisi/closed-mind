require('dotenv').config();
require('./mongo');

const express    = require('express');
const { Server } = require('socket.io');
const http       = require('http');
const cors       = require('cors');

const ChatRoom   = require('./models/ChatRoom');
const apiRoutes  = require('./routes/api.routes');

const generateHashCode = require('./helpers/randomHashCode');

const PORT = Number(process.env.PORT);

function main() {
  const app = express();
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    }
  });

  app.use(cors());
  app.use(express.json());
  app.use(express.static(__dirname+'/../public/'));

  app.use((req, res, next) => {
    console.log(`Request '${req.method}' received at ${req.url} for ${req.path}`);
    next();
  });
  app.use(apiRoutes);


  io.on('connection', (socket) => {
    console.log('\n🐢 [New socket connection]');
    console.log(' Sockets:', io.allSockets())

    socket.on('creating-chat-room', ({room_name, host}) => {

      const room_code = room_name + generateHashCode();
      
      const newChatRoom = new ChatRoom({
        host: host,
        code: room_code,
        is_open: true,
        created_date: new Date().toUTCString(),
        users: [
          {user_id: host}
        ],
        messages: []
      });
      newChatRoom.save().then(createdChatRoom => {
        socket.join(room_code);
        socket.currentRoomCode = room_code;
        socket.currentUserId = host;
        console.log('\n🗣 New room created:', room_code)
        socket.emit('room-created', {createdChatRoom})
      })
    })
    socket.on('joining-to-chat', ({room_code, user_id}) => {

      console.log('😖 Fetching room to database');
      console.time('fetching')
      let date = new Date().toUTCString();
      ChatRoom.findOneAndUpdate({code: room_code}, {
        $push: {
          users: {user_id: user_id},
          messages: {
            from: 'Server',
            text: `${user_id} has joined to the chat`,
            date: date
          }
        }
      }, {new: true}).then(joinedChatRoom => {
        if (joinedChatRoom !== null) {
          console.log('😐 Fetched');
          console.timeLog('fetching')
          socket.join(room_code);
          socket.emit('joined', joinedChatRoom);
          socket.to(room_code).emit('user-connected', {date, user_id});
          socket.currentRoomCode = room_code;
          socket.currentUserId = user_id;
          console.log(`🐌 <${joinedChatRoom.code}> ${user_id} joined`);
          console.log('🙂 Joined');
          console.timeEnd('fetching')
        }
        else {
          socket.emit('error', {
            message: 'Room not founded'
          })
        }
      }).catch(error => console.error('Error on socket->join:', error));

      // else res.status(400).end(); Handle this
    })
    socket.on('sending-message', ({user_id, user_color, date, message}) => {

      ChatRoom.findOneAndUpdate({code: socket.currentRoomCode}, {
        $push: {
          messages: {
            from: user_id,
            color: user_color,
            text: message,
            date: date
          }
        }
      }, {new: true}).then(updatedChatRoom => {
        console.log(`🐌 <${socket.currentRoomCode}> ${user_id} says:  ${message}`);
        // Emitting the event for all the sockets in its room, except itself
        socket.broadcast.to(socket.currentRoomCode).emit('message-received', {date, user_id, user_color, message});
        io.to(socket.id).emit('message-sended');
      }).catch(error => console.log('Error on socket->message', error));
    })
    socket.on('banning-user', ({user_id, reason}) => {
      let date = new Date().toUTCString()
      let server_log = {
        from: 'Server',
        text: `${user_id} has been banned, Reason: ${reason}`,
        date: date
      }
      ChatRoom.findOneAndUpdate({code: socket.currentRoomCode}, {
        $pull: {
          users: {user_id: user_id}
        },
        $push: {
          messages: server_log
        }
      }, {new: true}).then(updatedChatRoom => io.to(updatedChatRoom.code).fetchSockets())
      .then(roomSockets => {
        for (let userSocket of roomSockets) {
          if (userSocket.currentUserId === user_id) {
            io.to(socket.currentRoomCode).emit('user-disconnected', {user_id, server_log});
            userSocket.emit('disconnected-from-room', user_id);
            userSocket.leave(socket.currentRoomCode);
            console.log(`🐌 <${socket.currentRoomCode}> ${user_id} has been banned (->banning)`);
            userSocket.currentRoomCode = '';
          }
        }
      });
    })
    socket.on('leaving-from-chat', ({room_code, user_id, farewell}) => {
      let date = new Date().toUTCString()
      let server_log = {
        from: 'Server',
        text: `${user_id} has disconnected` + farewell ? `: "${farewell}"` : '',
        date: date
      }
      ChatRoom.findOneAndUpdate({code: room_code}, {
        $pull: {
          users: {user_id: user_id}
        },
        $push: {
          messages: server_log
        }
      }, {new: true}).then(updatedChatRoom => {

        socket.leave(socket.currentRoomCode);
        io.to(room_code).emit('user-disconnected', {user_id, server_log});
        socket.emit('disconnected-from-room', user_id);
        console.log(`🐌 <${updatedChatRoom.code}> ${user_id} has disconnected (->leaving)`);
        socket.currentRoomCode = '';

      }).catch(error => console.log('Error on socket->leave', error));
    })

    socket.on('disconnect', () => {
      console.log('\n🐢 [Socket disconnection]');
      console.log(' Sockets:', io.allSockets());
      let date = new Date().toUTCString();
      let server_log = {
        from: 'Server',
        text: `${socket.currentUserId} has disconnected`,
        date: date
      }

      if (socket.currentRoomCode) {
        ChatRoom.findOneAndUpdate({code: socket.currentRoomCode}, {
          $pull: {
            users: {user_id: socket.currentUserId}
          },
          $push: {
            messages: server_log
          }
        }, {new: true}).then(updatedRoom => {
          socket.leave(socket.currentRoomCode);
          io.to(socket.currentRoomCode).emit('user-disconnected', {user_id: socket.currentUserId, server_log});
          // socket.emit('disconnected-from-room', user_id); ?
          // (NO, because the socket has disconnected, so the event will never come
          //  unless the socket connects again, which could lead to bugs)
          console.log(`🐌 <${socket.currentRoomCode}> ${socket.currentUserId} has disconnected (->disconnect)`);
          socket.currentRoomCode = '';
        }).catch(error => console.log('Error on socket->disconnect', error));
      }
      socket.disconnect();
    })
  })

  // No path found
  app.use((req, res) => {
    res.status(404).end();
  });
  app.use((error, req, res, next) => {
    console.log('Final middleware reached:', error.name);
    if (error.name === 'SyntaxError') res.status(404).end();
    else res.status(500).end();
  });

  httpServer.listen(PORT, () => {
    console.log('Server running on port', PORT);
  });
}
if (require.main === module) main();
