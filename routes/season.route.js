const express = require('express');
const mongoose = require('mongoose');
const Team = require('../models/team.model.js');
const Season = require('../models/season.model.js');
const {verifyJWT, logger} = require('../middlewares');

require("dotenv").config();

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

      // Disable all previous seasons
      team.seasons.forEach(s => s.isActive = false);

      // Push season to current team
      team.seasons.push({
        id: seasonId,
        isActive: true
      });

      await team.save();

      return res.status(200).send(team);
    } catch (err) {
      logger.error(err);
      return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
    }
  });


  // Get current season for player with a Team ID
  router.get('/current', verifyJWT, async (req, res) => {
    const { teamId } = req.query;
    const { _id: playerId } = req.decoded;

    if (!teamId)
      return res.status(400).send({error: 'MISSING_PARAMETERS'});

    try {
      const team = await Team.findOne({ 
        _id: teamId,
        'players.player': playerId
      }).populate('seasons.id');

      if (!team)
        return res.status(404).send({error: 'TEAM_NOT_FOUND'});

      const { id: currentSeason} = team.seasons.find(s => s.isActive);

      return res.status(200).send(currentSeason);
    } catch (err) {
      logger.error(err);
      return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
    }
  });


  // 
  router.get('/current/match', verifyJWT, async (req, res) => {
    const { teamId, player1, player2, player3, player4 } = req.query;

    if (!teamId)
        return res.status(400).send({error: 'MISSING_PARAMETERS'});

    const playersQuery = [
      player1 ? { 'players.player': player1 } : undefined,
      player2 ? { 'players.player': player2 } : undefined,
      player3 ? { 'players.player': player3 } : undefined,
      player4 ? { 'players.player': player4 } : undefined,
    ].filter(q => q !== undefined);

    if (!playersQuery.length)
      return res.status(400).send({error: 'MISSING_PLAYERS_ID'});

    try {
      // Get specified Team and check if all Players are in Team
      const team = await Team.findOne({ 
        _id: teamId,
        $and: playersQuery
      }).populate('seasons.id');

      if (!team)
        return res.status(404).send({error: 'TEAM_NOT_FOUND'});

      const {id: season} = team.seasons.find(s => s.isActive);

      return res.status(200).send(season);
    } catch (err) {
      logger.error(err);
      return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
    }
  });
  

  return router;
})()
