
// ah, shit... here we go again

export const setGlobalUsername = ({ username, userCode }) => {
  return {
    type: '@user/setUsername',
    payload: { username, userCode }
  };
};
export const setGlobalColor = ({ color }) => {
  return {
    type: '@user/setColor',
    payload: { color }
  };
};

export const connectSocket = () => {
  return {
    type: '@socket/connect',
    payload: {}
  };
};
export const disconnectSocket = ({}) => {
  return {
    type: '@socket/disconnect'
  };
};

export const joinToRoom = ({ chatRoom }) => {
  return {
    type: '@commands/join',
    payload: { chatRoom }
  };
};
export const disconnectFromRoom = () => {
  return {
    type: '@commands/leave'
  };
};
export const clearChat = () => {
  return {
    type: '@commands/clear'
  };
};

export const appendUser = ({ user, server_log }) => {
  return {
    type: '@chat/appendUser',
    payload: { user, server_log }
  };
};
export const popUser = ({ user_id, server_log }) => {
  return {
    type: '@chat/popUser',
    payload: { user_id, server_log }
  };
};
export const appendMessage = ({ date, from, color, text, message_id, replyingTo, media }) => {
  return {
    type: '@chat/appendMessage',
    payload: { date, from, color, text, message_id, replyingTo, media }
  };
};
export const reactToMessage = ({ message_id, emote ,from }) => {
  return {
    type: '@chat/reactToMessage',
    payload: { message_id, emote, from }
  }
};
export const deleteReactionFromMessage = ({ message_id, emote ,from }) => {
  return {
    type: '@chat/deleteReaction',
    payload: { message_id, emote, from }
  }
};
export const decreaseReactionFromMessage = ({ message_id, emote ,from }) => {
  return {
    type: '@chat/decreaseReaction',
    payload: { message_id, emote, from }
  }
};
export const appendErrorMessage = ({ message }) => {
  return {
    type: '@chat/appendErrorMessage',
    payload: { message }
  };
};
export const saveLineToHistory = ({ line }) => {
  return {
    type: '@chat/saveLineToHistory',
    payload: { line }
  };
};