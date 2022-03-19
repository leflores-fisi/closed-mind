
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
export const clearTerminal = () => {
  return {
    type: '@commands/clear'
  };
};

export const appendUser = ({ user, server_log }) => {
  return {
    type: '@terminal/appendUser',
    payload: { user, server_log }
  };
};
export const popUser = ({ user_id, server_log }) => {
  return {
    type: '@terminal/popUser',
    payload: { user_id, server_log }
  };
};
export const appendMessage = ({ date, from, color, text }) => {
  return {
    type: '@terminal/appendMessage',
    payload: { date, from, color, text }
  };
};
export const appendErrorMessage = ({ message }) => {
  return {
    type: '@terminal/appendErrorMessage',
    payload: { message }
  };
};
export const saveLineToHistory = ({ line }) => {
  return {
    type: '@terminal/saveLineToHistory',
    payload: { line }
  };
};