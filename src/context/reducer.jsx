//import { useLocation } from 'wouter';

export const reducer = (state, action) => {

  console.log('On reducer:', action.type);

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

    case '@commands/connect':
      let {chatRoom} = action.payload;

      return {
        ...state,
        room_id: chatRoom.code,
        host: chatRoom.host,
        created_date: chatRoom.created_date,
        is_open: chatRoom.is_open,
        users: chatRoom.users,
        messages: chatRoom.messages
      };
    case '@commands/leave':
      return {
        ...state,
        room_id: '',
        host: '',
        created_date: undefined,
        is_open: undefined,
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
        users: state.users.concat({user_id: action.payload.user_id}),
        messages: state.messages.concat({
          from: 'Server',
          text: `${action.payload.user_id} has joined`,
          date: action.payload.date
        })
      };
    case '@terminal/appendMessage':

      return {
        ...state,
        messages: state.messages.concat({
          date: action.payload.date,
          from: action.payload.user_id || '??',
          text: action.payload.message,
          color: action.payload.user_color
        })
      };
    case '@terminal/appendErrorMessage':

      return {
        ...state,
        messages: state.messages.concat({
          date: undefined,
          from: 'ErrorHandler',
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