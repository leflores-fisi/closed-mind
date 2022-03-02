// ah, shit... here we go again

export const setGlobalUsername = ({ username, userCode }) => {
  return {
    type: '@user/setUsername',
    payload: { username, userCode }
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
    type: '@socket/disconnect',
    payload: {}
  };
};

export const createChat = ({ code, host }) => {
  return {
    type: '@commands/create',
    payload: { code, host }
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
    type: '@commands/leave',
    payload: {}
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
export const appendMessage = ({ date, user_id, message }) => {
  return {
    type: '@terminal/appendMessage',
    payload: { date, user_id, message }
  };
};
export const saveLineToHistory = ({ line }) => {
  return {
    type: '@terminal/saveLineToHistory',
    payload: { line }
  };
};