import io from 'socket.io-client';
export const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:8001' :'https://closedmind-api.herokuapp.com';
export const SELF_URL = import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://closedmind.vercel.app';

export const userSocket = io(API_URL, {
  withCredentials: true,
  autoConnect: false,
  requestTimeout: 5000
});
userSocket.onAny((event, ...args) => {
  console.log('Incoming:', event, args);
});

export const emitSocketEvent = {
  /**
   * Expects for "disconnected-from-room" server response
   * @param {object} params
   * @param {string} params.farewell the user farewell for the room
   */
  "leaving-from-chat": ({farewell} = {}) => {
    userSocket.emit('leaving-from-chat', {farewell})
  },
  /**
   * Expects for "message-sent" server response
   * @param {object} params
   * @param {string} params.date current date on UTCString
   * @param {string} params.message user message
   */
  "sending-message": ({ date, message, message_id }) => {
    userSocket.emit('sending-message', {
      date,
      message,
      message_id
    })
  },
  /**
   * Search the user on the sockets and forces him to emit "leaving-from-room" event
   * @param {object} params
   * @param {string} params.user_id id of user banned
   * @param {string} params.reason ban reason (displayed on the chat)
   */
  "banning-user": ({user_id, reason}) => {
    userSocket.emit('banning-user', {
      user_id,
      reason
    });
  },
  /**
   * Expects for "pong" server response
   */
  "ping": () => {
    userSocket.emit('ping', Date.now())
  },
  /**
   * Expects for "joined" server response
   * @param {object} params
   * @param {string} params.room_code code that will trying to fetch
   * @param {object} params.user
   * @param {string} params.user.user_id the user id
   * @param {string} params.user.user_color the user color
   * @param {boolean} params.from_invitation is joining from invitation?
   */
  "joining-to-chat": ({ room_code, user, from_invitation }) => {
    userSocket.emit('joining-to-chat', {
      room_code,
      user,
      from_invitation
    });
  },
  /**
   * Expects for "room-created" server response
   * @param {object} params
   * @param {string} params.room_name the name of the new chat room
   * @param {object} params.host
   * @param {string} params.host.user_id the user id of the host
   * @param {string} params.host.user_color the user color of the host
   */
  "creating-chat-room": ({ room_name, host }) => {
    userSocket.emit('creating-chat-room', {
      room_name,
      host
    })
  },
  "new-reaction-to-message": ({ message_id, emote }) => {
    userSocket.emit('new-reaction-to-message', {
      message_id,
      emote
    })
  },
  "reacting-to-message": ({ message_id, emote }) => {
    userSocket.emit('reacting-to-message', {
      message_id,
      emote
    })
  },
  "decreasing-reaction": ({ message_id, emote }) => {
    userSocket.emit('decreasing-reaction', {
      message_id,
      emote
    })
  },
  "deleting-reaction-from-message": ({ message_id, emote }) => {
    userSocket.emit('deleting-reaction-from-message', {
      message_id,
      emote
    })
  }
}