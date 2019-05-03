const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const PlayingMatch = require('./../models/playingMatch.model.js')
const logger = require('log4js').getLogger();

module.exports = (() => {
  const router = express.Router();

  // Get current match through Player ID
  router.get('/api/playingMatch', (req, res) => {
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, async (err, decoded) => {
      if (decoded) {
        console.log(decoded);

        try {
          const currentMatch = await PlayingMatch.findOne({
            $or: [
              {
                player1: decoded._id
              }, {
                player2: decoded._id
              }, {
                player3: decoded._id
              }, {
                player4: decoded._id
              }, {
                publisher: decoded._id
              }
            ]
          }).exec();

          if (currentMatch) { // match is being played
            console.log(currentMatch._id);

            return res.status(200).send(currentMatch);
            // on front, send match state
          } else {
            console.log('not found');
            return res.status(404).send({error: 'NOT_FOUND'});
            // on front, keep going
          }
        } catch (err) {
          logger.error(err);
          return res.status(500).json({error: 'INTERNAL_SERVER_ERROR'})
        }

      } else { // Token expired or no token

        // TODO: Ask for connection

        res.clearCookie('token')
        return res.status(401).send({error: 'TOKEN_EXPIRED'})
      }
    });
  });

  // Create match
  router.post('/api/playingMatch', (req, res) => {
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
      if (decoded) {
        console.log(decoded);
        console.log(req.body);
        const matchId = new mongoose.Types.ObjectId();
        const match = new PlayingMatch({
          _id: matchId,
          player1: mongoose.Types.ObjectId(req.body.player1),
          player2: mongoose.Types.ObjectId(req.body.player2),
          player3: mongoose.Types.ObjectId(req.body.player3),
          player4: mongoose.Types.ObjectId(req.body.player4),
          publisher: mongoose.Types.ObjectId(decoded._id),
          history: [],
          createdAt: Date.now(),
          score1: 0,
          score2: 0
        });
        match.save().then((result) => {
          logger.debug('Match begin');
          logger.debug(result);
          return res.status(201).send(result);
        }).catch((err) => {
          logger.error(err);
          return res.status(500).json({error: 'INTERNAL_SERVER_ERROR'})
        })

      } else { // Token expired or no token

        // TODO: Ask for connection

        res.clearCookie('token')
        return res.status(401).send({error: 'TOKEN_EXPIRED'})
      }
    });
  });

  // TODO: Delete route -> delete current match if finished or timeout

  return router;
})()
