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