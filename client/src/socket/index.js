import * as io from 'socket.io-client';

const socket = io((
  process.env.NODE_ENV === 'development'
  ? 'http://localhost:8116'
  : '') + '/match');

export {
  socket
};
