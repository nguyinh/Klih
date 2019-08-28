const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Player = require('./../models/player.model.js');
const {verifyJWT, logger} = require('../middlewares');

module.exports = (() => {
  const router = express.Router();

  router.get('/players/:playerId', verifyJWT, async (req, res) => {
    try {
      const player = await Player.findOne({_id: req.params.playerId}).exec();
      if (player) {
        return res.status(200).send({_id: player._id, firstName: player.firstName, lastName: player.lastName, email: player.email, avatar: player.avatar})
      } else {
        return res.status(404).send({error: 'PLAYER_NOT_FOUND'});
      }
    } catch (err) {
      logger.error(err);
      return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'})
    }
  });

  return router
})()
