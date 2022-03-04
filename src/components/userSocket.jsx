import io from 'socket.io-client';

export const userSocket = io('http://localhost:8001', {
  withCredentials: true,
  autoConnect: false,
  requestTimeout: 5000
});