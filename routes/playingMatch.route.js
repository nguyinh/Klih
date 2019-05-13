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
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, async (err, decoded) => {
      if (decoded) {
        try {
          // Search for players who are already in match
          let newPlayers = [];
          if (req.body.player1) 
            newPlayers.push(req.body.player1);
          if (req.body.player2) 
            newPlayers.push(req.body.player2);
          if (req.body.player3) 
            newPlayers.push(req.body.player3);
          if (req.body.player4) 
            newPlayers.push(req.body.player4);
          if (req.body.publisher) 
            newPlayers.push(req.body.publisher);
          
          const matchPlaying = await PlayingMatch.findOne({
            $or: [
              {
                player1: {
                  $in: newPlayers
                }
              }, {
                player2: {
                  $in: newPlayers
                }
              }, {
                player3: {
                  $in: newPlayers
                }
              }, {
                player4: {
                  $in: newPlayers
                }
              }, {
                publisher: {
                  $in: newPlayers
                }
              }
            ]
          }).exec();

          if (matchPlaying) {
            return res.status(409).send({error: 'PLAYERS_ALREADY_IN_MATCH'});
          } else {
            const thisID = new mongoose.Types.ObjectId();
            let match = new PlayingMatch({
              _id: thisID,
              publisher: mongoose.Types.ObjectId(decoded._id),
              history: [],
              createdAt: Date.now(),
              lastUpdateAt: Date.now(),
              score1: 0,
              score2: 0
            });
            // console.log(req.body.player1);
            // console.log(mongoose.Types.ObjectId.isValid(req.body.player1));
            if (req.body.player1) 
              match.player1 = req.body.player1;
            
            if (req.body.player2) 
              match.player2 = req.body.player2;
            
            if (req.body.player3) 
              match.player3 = req.body.player3;
            
            if (req.body.player4) 
              match.player4 = req.body.player4;
            
            const result = await match.save();

            return res.status(201).send(result);
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

  return router;
})()
