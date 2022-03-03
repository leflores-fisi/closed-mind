require('dotenv').config();
require('./mongo');

const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');

const ChatRoom = require('./models/ChatRoom');
const apiRoutes = require('./routes/api.routes');
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
    console.log(`Request '${req.method}' received at PORT: ${req.socket.remotePort} for ${req.path}`);
    next();
  });
  app.use(apiRoutes);


  io.on('connection', (socket) => {
    console.log('[New socket connection]');
    console.log(io.allSockets())

    socket.on('creating-chat-room', ({room_id, host}) => {
      const newChatRoom = new ChatRoom({
        host: host,
        code: room_id,
        is_open: true,
        created_date: new Date().toUTCString(),
        users: [
          {user_id: host}
        ],
        messages: []
      });
      newChatRoom.save().then(createdChatRoom => {
        socket.join(room_id);
        socket.currentRoomId = room_id;
        console.log('Info, rooms:', socket.rooms, 'RoomId:', room_id)
        socket.emit('room-created', {createdChatRoom})
      })
    })
    socket.on('joining-to-chat', ({room_id, user_id}) => {

      let date = new Date().toUTCString();
      ChatRoom.findOneAndUpdate({code: room_id}, {
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
          socket.join(room_id);
          socket.emit('joined', joinedChatRoom);
          socket.to(room_id).emit('user-connected', {date, user_id});
          socket.currentRoomId = room_id;
          socket.currentUserId = user_id;
          console.log(`${user_id} joined`);
          console.log(io.allSockets())
        }
        else {
          socket.emit('error', {
            message: 'Room not founded'
          })
        }
      }).catch(error => console.error('Error on socket->join:', error));

      // else res.status(400).end(); Handle this
    })
    socket.on('sending-message', ({user_id, user_color, message}) => {
      let date = new Date().toUTCString();
      ChatRoom.findOneAndUpdate({code: socket.currentRoomId}, {
        $push: {
          messages: {
            from: user_id,
            color: user_color,
            text: message,
            date: date
          }
        }
      }, {new: true}).then(updatedChatRoom => {
        console.log(`${user_id} says to room ${socket.currentRoomId}:  ${message}`);
        io.to(socket.currentRoomId).emit('message-sended', {date, user_id, user_color, message})
      }).catch(error => console.log('Error on socket->message', error));
    })
    socket.on('leaving-from-chat', ({room_id, user_id}) => {
      let date = new Date().toUTCString()
      ChatRoom.findOneAndUpdate({code: room_id}, {
        $pull: {
          users: {user_id: user_id}
        },
        $push: {
          messages: {
            from: 'Server',
            text: `${user_id} has disconnected`,
            date: date
          }
        }
      }, {new: true}).then(updatedChatRoom => {
        socket.leave(socket.currentRoomId)
        io.to(room_id).emit('user-disconnected', {date, user_id});
        socket.emit('disconnected', user_id);
        console.log(`${user_id} has disconnected (->leaving)`);
        socket.currentRoomId = '';

      }).catch(error => console.log('Error on socket->leave', error));
    })

    socket.on('disconnect', () => {
      console.log('[Socket disconnected]');
      let date = new Date().toUTCString();

      if (socket.currentRoomId) {
        ChatRoom.findOneAndUpdate({code: socket.currentRoomId}, {
          $pull: {
            users: {user_id: socket.currentUserId}
          },
          $push: {
            messages: {
              from: 'Server',
              text: `${socket.currentUserId} has disconnected`,
              date: date
            }
          }
        }, {new: true}).then(updatedRoom => {
          io.to(socket.currentRoomId).emit('user-disconnected', {date, user_id: socket.currentUserId});
          console.log(`${socket.currentUserId} has disconnected (->disconnected)`);
        }).catch(error => console.log('Error on socket->disconnect', error));
      }
      console.log(io.allSockets());
      socket.disconnect();
    })
  })

  // No path found
  app.use((req, res) => {
    res.status(404).end();
  });
  app.use((error, req, res, next) => {
    console.log('Final middleware reached, so... FATAL ERROR:', error.name);
    res.status(500).end();
  });

  httpServer.listen(PORT, () => {
    console.log('Server running on port', PORT);
  });
}
if (require.main === module) main();
