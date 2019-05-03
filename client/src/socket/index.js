import io from 'socket.io-client';

const socket = io('http://localhost:8117/match');
//
// socket.on('ready', (data) => {
//   console.log(data);
// });
//
// socket.emit('identify', {roomName: 'test'});

export {
  socket
};
