const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Player = require('./../models/player.model.js');
const logger = require('log4js').getLogger();

module.exports = (() => {
  const router = express.Router()

  router.get('/api/players/:playerId', (req, res) => {
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, async (err, decoded) => {
      if (decoded) {

        try {
          const player = await Player.findOne({_id: req.params.playerId}).exec();

          if (player) {
            return res.status(200).send({_id: player._id, firstName: player.firstName, lastName: player.lastName, email: player.email, avatar: player.avatar})
          } else {
            console.log('not found');
          }
          return res.status(200)
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

  return router
})()
