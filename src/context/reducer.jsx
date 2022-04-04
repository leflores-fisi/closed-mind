import produce from 'immer';

export const reducer = (state, action) => {

  console.log('On reducer:', action.type);
  let messageIndex; // TODO: export as a function

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

    case '@chat/popUser':
      return {
        ...state,
        users: state.users.filter(user => user.user_id !== action.payload.user_id),
        messages: state.messages.concat(action.payload.server_log)
      };
    case '@chat/appendUser': 
      return {
        ...state,
        users: state.users.concat(action.payload.user),
        messages: state.messages.concat(action.payload.server_log)
      };
    case '@chat/appendMessage':

      return {
        ...state,
        messages: state.messages.concat({
          date: action.payload.date,
          from: action.payload.from || '??',
          text: action.payload.text,
          color: action.payload.color,
          message_id: action.payload.message_id,
          replyingTo: action.payload.replyingTo,
          reactions: [],
          media: action.payload.media || []
        })
      };
    case '@chat/reactToMessage':

      messageIndex = state.messages.findIndex(message => message.message_id === action.payload.message_id); 
      if (messageIndex === -1) return {...state};

      return produce(state, draftState => {
        let reactionIndex = state.messages[messageIndex].reactions.findIndex(reaction => reaction.emote === action.payload.emote);
        if (reactionIndex === -1) {
          draftState.messages[messageIndex].reactions.push({
            emote: action.payload.emote,
            users_list: [action.payload.from]
          });
        }
        else {
          draftState.messages[messageIndex].reactions[reactionIndex].users_list.push(action.payload.from);
        }
        return draftState;
      })
    case '@chat/deleteReaction':
      messageIndex = state.messages.findIndex(message => message.message_id === action.payload.message_id); 
      if (messageIndex === -1) return {...state};

      return produce(state, draftState => {
        let reactionIndex = state.messages[messageIndex].reactions.findIndex(reaction => reaction.emote === action.payload.emote);
        // If exist the reaction
        if (reactionIndex !== -1) {
          draftState.messages[messageIndex].reactions.splice(reactionIndex, 1);
        }
        return draftState;
      })
    case '@chat/decreaseReaction':
      messageIndex = state.messages.findIndex(message => message.message_id === action.payload.message_id); 
      if (messageIndex === -1) return {...state};

      return produce(state, draftState => {
        let reactionIndex = state.messages[messageIndex].reactions.findIndex(reaction => reaction.emote === action.payload.emote);
        // If exist the reaction
        if (reactionIndex !== -1) {
          let userIndex = state.messages[messageIndex].reactions[reactionIndex].users_list.findIndex(user_id => user_id === action.payload.from);
          // If the users that we are trying to remove it is in the list
          if (userIndex !== -1) {
            draftState.messages[messageIndex].reactions[reactionIndex].users_list.splice(userIndex, 1);
          }
        }
        return draftState;
      })
    case '@chat/appendErrorMessage':

      return {
        ...state,
        messages: state.messages.concat({
          date: undefined,
          from: '@senders/ERROR_HANDLER',
          text: action.payload.message
        })
      };
    case '@chat/saveLineToHistory':
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