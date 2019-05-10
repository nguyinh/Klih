import io from 'socket.io-client';

const socket = io('http://localhost:8116/match');

export {
  socket
};
