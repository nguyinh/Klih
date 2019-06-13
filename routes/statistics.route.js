const express = require('express');
const mongoose = require('mongoose');
const Player = require('../models/player.model.js');
const Match = require('../models/match.model.js');
const {verifyJWT, logger} = require('../middlewares');

require("dotenv").config();

module.exports = (() => {
  const router = express.Router()

  router.get('/statistics/winLossRatio', verifyJWT, async (req, res) => {
    let matchWins = 0;
    let matchLosses = 0;
    let matchCount = 0;
    try {
      const matchs = await Match.find({
        $or: [
          {
            player1: req.decoded._id
          }, {
            player2: req.decoded._id
          }, {
            player3: req.decoded._id
          }, {
            player4: req.decoded._id
          }
        ]
      });

      matchs.forEach(m => {
        matchCount++;
        if (m.player1 == req.decoded._id || m.player2 == req.decoded._id) {
          if (m.score1 > m.score2) 
            matchWins++;
          else if (m.score1 < m.score2) 
            matchLosses++;
          }
        else if (m.player3 == req.decoded._id || m.player4 == req.decoded._id) {
          if (m.score2 > m.score1) 
            matchWins++;
          else if (m.score2 < m.score1) 
            matchLosses++;
          }
        });

      return res.status(200).send({wins: matchWins, losses: matchLosses, count: matchCount});
    } catch (err) {
      logger.error(err);
      return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
    }
  });

  return router;
})()
