module.exports = (server) => {
  const io = require('./match')(require('socket.io')(server));

  return io;
};
