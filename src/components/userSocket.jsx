import io from 'socket.io-client';
export const apiURL = 'https://closedmind-api.herokuapp.com'

export const userSocket = io(apiURL, {
  withCredentials: true,
  autoConnect: false,
  requestTimeout: 5000
});
userSocket.onAny((event, ...args) => {
  console.log('Incoming:', event, args);
});