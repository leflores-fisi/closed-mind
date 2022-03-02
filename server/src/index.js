require('dotenv').config();
require('./mongo');

const express = require('express');
const { Server } = require('socket.io');
const { isValidObjectId } = require('mongoose');
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
    console.log('New connection:');
    console.log(io.allSockets())

    socket.on('creating-chat-room', ({host}) => {
      const newChatRoom = new ChatRoom({
        code: 'none',
        host: host,
        is_open: true,
        created_date: new Date().toUTCString(),
        users: [
          {user_id: host}
        ],
        messages: []
      });
      newChatRoom.save().then(createdChatRoom => {
        socket.join(createdChatRoom.id.valueOf());
        console.log('Info, rooms:', socket.rooms, 'RoomId:', createdChatRoom.id.valueOf())
        socket.emit('room-created', {createdChatRoom})
        socket.currentRoomId = createdChatRoom.id.valueOf();
      })
    })
    socket.on('joining-to-chat', ({room_id, user_id}) => {
      if (isValidObjectId(room_id)) {
        let date = new Date().toUTCString();
        ChatRoom.findByIdAndUpdate(room_id, {
          $push: {
            users: {user_id: user_id},
            messages: {
              from: 'Server',
              text: `${user_id} has joined to the chat`,
              date: date
            }
          }
        }, {new: true}).then(joinedChatRoom => {
          socket.join(room_id);
          socket.emit('joined', joinedChatRoom);
          socket.to(room_id).emit('user-connected', {date, user_id});
          socket.currentRoomId = room_id;
          socket.currentUserId = user_id;
          console.log(`${user_id} joined`);
          console.log(io.allSockets())
        }).catch(error => console.error('Error on socket->join:', error));
      }
      // else res.status(400).end(); Handle this
    })
    socket.on('sending-message', ({user_id, message}) => {
      console.log('ROOM:', socket.currentRoomId);
      let date = new Date().toUTCString();
      ChatRoom.findByIdAndUpdate(socket.currentRoomId, {
        $push: {
          messages: {
            from: user_id,
            text: message,
            date: date
          }
        }
      }, {new: true}).then(updatedChatRoom => {
        console.log(`${user_id} says: ${message}`);
        io.to(socket.currentRoomId).emit('message-sended', {date, user_id, message})
      }).catch(error => console.log('Error on socket->message', error));
    })
    socket.on('leaving-from-chat', ({room_id, user_id}) => {
      let date = new Date().toUTCString()
      ChatRoom.findByIdAndUpdate(room_id, {
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
        socket.emit('disconnected', user_id);
        socket.leave(socket.currentRoomId)
        io.to(room_id).emit('user-disconnected', {date, user_id});
        console.log(`${user_id} has disconnected`);

      }).catch(error => console.log('Error on socket->leave', error));
    })

    socket.on('disconnect', () => {
      console.log('Disconnection:', socket.currentRoomId)
      let date = new Date().toUTCString();

      if (socket.currentRoomId) {
        ChatRoom.findByIdAndUpdate(socket.currentRoomId, {
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
          console.log(`${socket.currentUserId} has disconnected (->disconnect)`);
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
