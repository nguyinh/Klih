const express = require('express')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const Player = require('../models/player.model.js')
const Match = require('../models/match.model.js')
const logger = require('log4js').getLogger();

require("dotenv").config()

module.exports = (() => {
  const router = express.Router()

  router.post('/api/match', (req, res) => {
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
      if (decoded) {
        Player.findOne({email: decoded.email}).exec().then((user) => {
          if (user) { // User exists

            const match = new Match({
              _id: new mongoose.Types.ObjectId(),
              score1: req.body.score1,
              score2: req.body.score2,
              player1: req.body.player1,
              player2: req.body.player2,
              player3: req.body.player3,
              player4: req.body.player4,
              createdAt: Date.now(),
              duration: Date.now() - req.body.matchBegin,
              history: req.body.history,
              team: req.body.team
            }) // Create and save new match

            match.save().then((result) => {
              logger.debug('match saved !');
              return res.status(201).json({match: match})
            }).catch((error) => {
              console.log(error)
              return res.status(500).json({error: 'INTERNAL_SERVER_ERROR'})
            })

          } else { // User no longer exists
            res.clearCookie('token')
            return res.status(401).send({error: 'USER_NO_LONGER_EXISTS'})
          }
        })

      } else { // Token expired or no token

        // TODO: Ask for connection

        res.clearCookie('token')
        return res.status(401).send({error: 'TOKEN_EXPIRED'})
      }
    })
  })

  return router
})()
