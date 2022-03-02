

export const reducer = (state, action) => {

  console.log('On reducer:', action, state)
  switch (action.type) {

    case '@user/setUsername':
      return {
        ...state,
        username: action.payload.username,
        user_code: action.payload.userCode,
        user_id: action.payload.username + action.payload.userCode
      };

    case '@socket/connect':
    return {
      ...state,
      is_connected: true
    };
    case '@socket/disconnect':
      return {
        ...state,
        is_connected: false
      };

    case '@commands/create':
      return state;
    case '@commands/connect':
      let {chatRoom} = action.payload;

      return {
        ...state,
        room_id: chatRoom.id,
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

    case '@terminal/popUser':
      return {
        ...state,
        users: state.users.filter(user => user.user_id !== action.payload.user_id),
        messages: state.messages.concat({
          from: 'Server',
          text: `${action.payload.user_id} has disconnected`,
          date: action.payload.date
        })
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