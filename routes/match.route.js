const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Player = require('../models/player.model.js');
const Match = require('../models/match.model.js');
const {verifyJWT, logger} = require('../middlewares');

require("dotenv").config();

module.exports = (() => {
  const router = express.Router();

  // DEPRECATED
  // Match save in socket match file
  router.post('/match', verifyJWT, async (req, res) => {
    try {
      const user = await Player.findOne({_id: req.decoded._id}).exec();
      if (user) { // User exists

        const match = new Match({
          _id: new mongoose.Types.ObjectId(),
          score1: req.body.score1,
          score2: req.body.score2,
          player1: req.body.player1,
          player2: req.body.player2,
          player3: req.body.player3,
          player4: req.body.player4,
          publisher: req.decoded._id,
          createdAt: Date.now(),
          duration: Date.now() - req.body.matchBegin,
          history: req.body.history,
          team: req.body.team
        }) // Create and save new match

        const result = await match.save();
        return res.status(201).send({match: match});

      } else { // User no longer exists
        res.clearCookie('token');
        return res.status(401).send({error: 'USER_NO_LONGER_EXISTS'});
      }
    } catch (err) {
      logger.error(err);
      return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
    }
  })

  return router
})()
