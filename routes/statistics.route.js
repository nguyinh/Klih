const express = require('express');
const mongoose = require('mongoose');
const Player = require('../models/player.model.js');
const {verifyJWT, logger} = require('../middlewares');

require("dotenv").config();

module.exports = (() => {
  const router = express.Router()

  router.post('/api/statistics', verifyJWT, async (req, res) => {
    try {
      logger.debug('STATS');
      return res.status(201).send({team: team});
    } catch (err) {
      logger.error(err);
      return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
    }
  });

  return router;
})()
