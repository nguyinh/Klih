const io = require('socket.io')(8117);
const logger = require('log4js').getLogger();
const PlayingMatch = require('./../models/playingMatch.model.js')
const mongoose = require('mongoose');

const matchIO = io.of('/match');
const tableIO = io.of('/table');

matchIO.on('connection', (socket) => {
  logger.debug('socket connected');

  socket.emit('ready', {hello: 'world'});

  // DEPRECATED
  // Check if match is playing for player id
  socket.on('isMatchPlaying', async (playerId) => {
    logger.debug(playerId);
    try {
      // let user = await Player.findOne({_id: data}).exec();
      const match = await PlayingMatch.findOne({
        $or: [
          {
            player1: playerId
          }, {
            player2: playerId
          }, {
            player3: playerId
          }, {
            player4: playerId
          }
        ]
      }).exec();

      if (match) { // match is being played
        console.log(match._id);
        socket.emit('isMatchPlaying', match._id);
        socket.join(match._id);
        // on front, send match state
      } else {
        console.log('not found');
        socket.emit('isMatchPlaying', 'NOT_FOUND');
        // on front, keep going
      }
    } catch (err) {
      console.log(err);
      socket.emit('isMatchPlaying', 'ERROR');
    }
    // socket.join(data.roomName);
    // socket.to('test').emit('ready', {message: 'works'});
    // socket.disconnect();
  });

  // On joinMatch if Match is playing
  socket.on('joinMatch', async (matchId) => {

    try {
      const match = await PlayingMatch.findOne({_id: matchId}).exec();

      if (match) { // Match is being played
        socket.join(matchId); // Socket join room 'matchId'
        socket.emit('joinMatch', match); // Return actual match data
        // on front, send match state
      } else {
        logger.debug('Match not found');
        socket.emit('joinMatch', 'NOT_FOUND');
        // on front, keep going
      }
    } catch (err) {
      logger.error(err);
      socket.emit('joinMatch', 'ERROR');
    }
  });

  // On goal event
  socket.on('goalEvent', async (data) => {
    console.log(data.match);
    try {
      const match = await PlayingMatch.findOne({_id: data.currentMatchId}).exec();

      if (match) {
        match.score1 += data.match.score1;
        match.score2 += data.match.score2;
        match.history = [
          ...match.history, {
            ...data.match.history,
            goalTime: parseInt((Date.now() - match.createdAt) / 60000)
          }
        ];

        // Save new match state
        await match.save();

        // Return new match state to subscribers
        matchIO.to(data.currentMatchId).emit('goalEvent', match);

        // TODO: Send here restricted data to Table viewers
      } else {
        console.log('not found');
      }
    } catch (err) {
      logger.error(err)
    }
  });

  socket.on('disconnect', (reason) => {
    logger.debug('socket disconnected: ' + reason);
  });
});

module.exports = () => {
  io
}
