
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

export const connectToRoom = ({ chatRoom }) => {
  return {
    type: '@commands/connect',
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

export const appendUser = ({ date, user_id }) => {
  return {
    type: '@terminal/appendUser',
    payload: { date, user_id }
  };
};
export const popUser = ({ date, user_id }) => {
  return {
    type: '@terminal/popUser',
    payload: { date, user_id }
  };
};
export const appendMessage = ({ date, user_id, user_color, message }) => {
  return {
    type: '@terminal/appendMessage',
    payload: { date, user_id, user_color, message }
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