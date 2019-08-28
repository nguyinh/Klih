const express = require('express');
const mongoose = require('mongoose');
const Team = require('../models/team.model.js');
const Season = require('../models/season.model.js');
const {verifyJWT, logger} = require('../middlewares');

require("dotenv").config()

module.exports = (() => {
  const router = express.Router();

  router.post('/create', verifyJWT, async (req, res) => {
    const { teamId, seasonName } = req.query;
    const { _id: playerId } = req.decoded;

    if (!teamId || !seasonName)
        return res.status(400).send({error: 'MISSING_PARAMETERS'});

    try {
      const team = await Team.findOne({ _id: teamId });

      const player = team.players.find(p => p.player == playerId);

      if (!player)
        return res.status(404).send({error: 'PLAYER_NOT_FOUND'});
      if (!player.isAdmin)
        return res.status(403).send({error: 'PLAYER_NOT_ADMIN'});

      const season = new Season({
        _id: new mongoose.Types.ObjectId(),
        name: seasonName,
        number: team.seasons.length + 1,
        createdAt: Date.now()
      }); // Create and save new season

      const { _id: seasonId } = await season.save();

      // Push season to current team
      team.seasons.push(seasonId);

      await team.save();

      return res.status(200).send(team.toObject());

    } catch (err) {
      logger.error(err);
      return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
    }
  });


  

  return router
})()
