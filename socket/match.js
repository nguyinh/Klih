module.exports = (io) => {

  const {logger} = require('../middlewares');
  const PlayingMatch = require('./../models/playingMatch.model.js')
  const Match = require('./../models/match.model.js')
  const mongoose = require('mongoose');
  const MATCH_TIMEOUT = 10 * (60 * 1000); // (milliseconds) Timeout for matchs inactive for 10 minutes
  const REFRESH_TIMEOUT = 2 * (60 * 1000); // (milliseconds) Search for inactive matchs every 2 minutes

  logger.info('[Socket.io] Initialization');

  const matchIO = io.of('/match');
  const tableIO = io.of('/table');

  matchIO.on('connection', (socket) => {
    logger.debug('[Socket.io] Client connected');

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

          match.lastUpdateAt = Date.now();
          await match.save();

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
    socket.on('goalEvent', async (data, onSaved) => {
      try {
        const match = await PlayingMatch.findOne({
          $and: [
            {
              _id: data.matchId
            }, {
              $or: [
                {
                  player1: data.playerId
                }, {
                  player2: data.playerId
                }, {
                  player3: data.playerId
                }, {
                  player4: data.playerId
                }, {
                  publisher: data.playerId
                }
              ]
            }
          ]
        }).exec();

        if (match) {
          match.score1 += data.match.score1;
          match.score2 += data.match.score2;
          match.history = [
            ...match.history, {
              ...data.match.history,
              goalTime: parseInt((Date.now() - match.createdAt) / 60000)
            }
          ];
          match.lastUpdateAt = Date.now();

          // Save new match state
          await match.save();

          // Return new match state to subscribers
          matchIO.to(data.matchId).emit('goalEvent', match);
          onSaved();
          // TODO: Send here restricted data to Table viewers
        } else {
          console.log('not found');
          // onSaved('NOT_FOUND');
        }
      } catch (err) {
        logger.error(err)
      }
    });

    // User validates Match
    socket.on('saveMatch', async (data) => {
      try {

        const currentMatch = await PlayingMatch.findOne({
          $and: [
            {
              _id: data.matchId
            }, {
              $or: [
                {
                  player1: data.playerId
                }, {
                  player2: data.playerId
                }, {
                  player3: data.playerId
                }, {
                  player4: data.playerId
                }, {
                  publisher: data.playerId
                }
              ]
            }
          ]
        }).exec();

        if (currentMatch) {
          let match = new Match({
            ...currentMatch._doc,
            duration: parseInt((Date.now() - currentMatch.createdAt) / 1000)
          }); // Create Match object based on playingMatch

          // Save new match and delete current one
          await match.save();
          await PlayingMatch.deleteOne({_id: data.matchId}).exec();

          // TODO: Insert here ELO changes
          // then send them to front-end

          matchIO.to(data.matchId).emit('matchEnded', {});

          // Each socket leave MatchId room
          for (socketID in matchIO.adapter.rooms[data.matchId].sockets) {
            const soc = matchIO.connected[socketID];
            soc.leave(data.matchId);
          }
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

    // User validates Match
    socket.on('cancelMatch', async (data) => {
      try {
        const currentMatch = await PlayingMatch.findOne({
          $and: [
            {
              _id: data.matchId
            }, {
              $or: [
                {
                  player1: data.playerId
                }, {
                  player2: data.playerId
                }, {
                  player3: data.playerId
                }, {
                  player4: data.playerId
                }, {
                  publisher: data.playerId
                }
              ]
            }
          ]
        }).exec();

        if (currentMatch) {
          await PlayingMatch.deleteOne({_id: data.matchId}).exec();

          matchIO.to(data.matchId).emit('matchCancelled', {reason: 'ENDED_BY_USER'});

          // Each socket leave MatchId room
          for (socketID in matchIO.adapter.rooms[data.matchId].sockets) {
            const soc = matchIO.connected[socketID];
            soc.leave(data.matchId);
          }
        } else {
          logger.debug('Match not found');
          socket.emit('joinMatch', 'NOT_FOUND');
          // on front, keep going
        }
      } catch (err) {
        logger.error(err);
      }
    });

    // On User disconnecting
    socket.on('disconnecting', async () => {
      // Refresh connected players sockets in matchId room

      try {
        // Get matchId
        const matchId = Object.values(socket.rooms)[1];

        // Refresh set of connected players
        if (matchIO.adapter.rooms[matchId]) {
          let playersSet = new Set();
          for (socketID in matchIO.adapter.rooms[matchId].sockets) {
            const soc = matchIO.connected[socketID];
            playersSet.add(soc.player);
          }
          // Delete current leaving player
          playersSet.delete(socket.player);

          matchIO.to(matchId).emit('onConnectedPlayersChange', {playersArray: Array.from(playersSet)});
        }
      } catch (err) {
        logger.error(err)
      }

    });

    // On disconnect
    socket.on('disconnect', (reason) => {
      logger.debug('socket disconnected: ' + reason);
    });
  });

  // Interval to search for inactive matchs
  setInterval(async () => {
    const inactiveMatchs = await PlayingMatch.find({
      lastUpdateAt: {
        "$lte": new Date(Date.now() - MATCH_TIMEOUT)
      }
    }).exec();

    inactiveMatchs.forEach(async ({_id}) => {
      // Delete match from DB
      await PlayingMatch.deleteOne({_id}).exec();
      // Emit match cancelled to matchId room
      matchIO.to(_id).emit('matchCancelled', {reason: 'MATCH_TIMEOUT'});
    });
  }, REFRESH_TIMEOUT);

  return io;
};
