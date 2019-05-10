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

  // User is joining Match
  socket.on('joinMatch', async (data) => {
    try {
      const match = await PlayingMatch.findOne({_id: data.matchId}).exec();

      if (match.player1 == data.playerId) {
        socket.player = 'P1';
      } else if (match.player2 == data.playerId) {
        socket.player = 'P2';
      } else if (match.player3 == data.playerId) {
        socket.player = 'P3';
      } else if (match.player4 == data.playerId) {
        socket.player = 'P4';
      }

      if (match) { // Match is being played
        socket.join(data.matchId); // Socket join room 'matchId'

        let playersSet = new Set();
        for (socketID in matchIO.adapter.rooms[data.matchId].sockets) {
          const soc = matchIO.connected[socketID];
          playersSet.add(soc.player);
        }
        console.log(playersSet);

        socket.emit('joinMatch', match); // Return actual match data
        matchIO.to(data.matchId).emit('onConnectedPlayersChange', {playersArray: Array.from(playersSet)});
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

  // Update connected Users
  // socket.on('updateConnectedUsers', async ({playerId, matchId}) => {
  //   try {
  //     const match = await PlayingMatch.findOne({_id: matchId}).exec();
  //
  //     if (match) {
  //       let connectedPlayersSet = new Set(match.connectedUsers);
  //
  //       if (match.player1 == playerId)
  //         connectedPlayersSet.add('P1');  match.connectedUsers.push('P1');
  //       else if (match.player2 == playerId)
  //         connectedPlayersSet.add('P2');  match.connectedUsers.push('P2');
  //       else if (match.player3 == playerId)
  //         connectedPlayersSet.add('P3');  match.connectedUsers.push('P3');
  //       else if (match.player4 == playerId)
  //         connectedPlayersSet.add('P4');
  //
  //       match.connectedUsers = Array.from(connectedPlayersSet);
  //
  //       await match.save();
  //
  //       matchIO.to(matchId).emit('usersUpdated', {connectedUsers: match.connectedUsers});
  //        cb(match.connectedUsers);
  //     } else {
  //       console.log('not found');
  //     }
  //   } catch (err) {
  //     logger.error(err)
  //   }
  //
  //   console.log(playerId, matchId);
  // });

  // On User disconnecting
  socket.on('disconnecting', async () => {
    // Refresh connected players sockets in matchId room

    try {
      // Get matchId
      const matchId = Object.values(socket.rooms)[1];
      console.log('player disconneting is : ' + socket.player);
      let playersSet = new Set();
      for (socketID in matchIO.adapter.rooms[matchId].sockets) {
        const soc = matchIO.connected[socketID];
        console.log(soc.player);
        playersSet.add(soc.player);
      }
      playersSet.delete(socket.player);
      // console.log(playersSet);
      matchIO.to(matchId).emit('onConnectedPlayersChange', {playersArray: Array.from(playersSet)});
    } catch (err) {
      logger.error(err)
    }

  });

  // On disconnect
  socket.on('disconnect', (reason) => {
    logger.debug('socket disconnected: ' + reason);
  });
});

module.exports = () => {
  io
}
