//import { useLocation } from 'wouter';

export const reducer = (state, action) => {

  switch (action.type) {

    case '@user/setUsername':
      return {
        ...state,
        username: action.payload.username,
        user_code: action.payload.userCode,
        user_id: action.payload.username + action.payload.userCode
      };
    case '@user/setColor':
      return {
        ...state,
        user_color: action.payload.color
      };

    case '@socket/connect':
    return {
      ...state,
      socket_is_connected: true
    };
    case '@socket/disconnect':
      return {
        ...state,
        socket_is_connected: false
      };

    case '@commands/join':
      let { chatRoom } = action.payload;

      return {
        ...state,
        room_code: chatRoom.code,
        last_room_code : state.room_code,
        host: chatRoom.host,
        created_date: chatRoom.created_date,
        invitations_only: chatRoom.invitations_only,
        users: chatRoom.users,
        messages: chatRoom.messages
      };
    case '@commands/leave':
      return {
        ...state,
        room_code: '',
        last_room_code : state.room_code,
        host: {},
        created_date: undefined,
        invitations_only: undefined,
        users: [],
        messages: []
      };
    case '@commands/clear':
      return {
        ...state,
        messages: []
      };

    case '@terminal/popUser':
      return {
        ...state,
        users: state.users.filter(user => user.user_id !== action.payload.user_id),
        messages: state.messages.concat(action.payload.server_log)
      };
    case '@terminal/appendUser': 
      return {
        ...state,
        users: state.users.concat(action.payload.user),
        messages: state.messages.concat(action.payload.server_log)
      };
    case '@terminal/appendMessage':

      return {
        ...state,
        messages: state.messages.concat({
          date: action.payload.date,
          from: action.payload.from || '??',
          text: action.payload.text,
          color: action.payload.color
        })
      };
    case '@terminal/appendErrorMessage':

      return {
        ...state,
        messages: state.messages.concat({
          date: undefined,
          from: '@senders/ERROR_HANDLER',
          text: action.payload.message
        })
      };
    case '@terminal/saveLineToHistory':
      let line = action.payload.line.trim();

      if (line !== state.commands_history.at(-1)) {
        return {
          ...state,
          commands_history: state.commands_history.concat(line)
        };
      }
      return state;
      break;

    default: throw new Error(`Reducer action ${type} not matched`);
  };
};