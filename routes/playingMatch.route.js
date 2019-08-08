const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const PlayingMatch = require('./../models/playingMatch.model.js')
const {verifyJWT, logger} = require('../middlewares');

module.exports = (() => {
  const router = express.Router();

  // Get current match through Player ID
  router.get('/playingMatch', verifyJWT, async (req, res) => {
    try {
      const currentMatch = await PlayingMatch.findOne({
        $or: [
          {
            player1: req.decoded._id
          }, {
            player2: req.decoded._id
          }, {
            player3: req.decoded._id
          }, {
            player4: req.decoded._id
          }, {
            publisher: req.decoded._id
          }
        ]
      }).populate('player1 player2 player3 player4').exec();

      if (currentMatch) { // match is being played
        const {
          _id,
          player1,
          player2,
          player3,
          player4
        } = currentMatch;

        const respMatch = {
          _id,
          player1: player1 ? {
            firstName: player1.firstName,
            lastName: player1.lastName,
            score: player1.score,
            image: player1.avatar,
            _id: player1._id
          } : undefined,
          player2: player2 ? {
            firstName: player2.firstName,
            lastName: player2.lastName,
            score: player2.score,
            image: player2.avatar,
            _id: player2._id
          } : undefined,
          player3: player3 ? {
            firstName: player3.firstName,
            lastName: player3.lastName,
            score: player3.score,
            image: player3.avatar,
            _id: player3._id
          } : undefined,
          player4: player4 ? {
            firstName: player4.firstName,
            lastName: player4.lastName,
            score: player4.score,
            image: player4.avatar,
            _id: player4._id
          } : undefined,
        }

        // Send players info
        return res.status(200).send(respMatch);
        // Then socket will send match state
      } else {
        return res.status(404).send({error: 'NOT_FOUND'});
      }
    } catch (err) {
      logger.error(err);
      return res.status(500).json({error: 'INTERNAL_SERVER_ERROR'})
    }
  });

  // Create match
  router.post('/playingMatch', verifyJWT, async (req, res) => {
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
          publisher: mongoose.Types.ObjectId(req.decoded._id),
          history: [],
          createdAt: Date.now(),
          lastUpdateAt: Date.now(),
          score1: 0,
          score2: 0
        });

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
  });

  return router;
})()
