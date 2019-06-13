const express = require('express')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const path = require('path');
const Team = require('../models/team.model.js')
const Player = require('../models/player.model.js')
const {verifyJWT, logger} = require('../middlewares');

require("dotenv").config()

module.exports = (() => {
  const router = express.Router()

  router.post('/team/create', verifyJWT, async (req, res) => {
    try {
      const player = await Player.findOne({_id: req.decoded._id}).exec();
      let tag = '';
      let available = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      do {
        for (let i = 0; i < 6; i++) // Create random teamTag
          tag += available.charAt(Math.floor(Math.random() * available.length));
        
        // Search for other occurencies of teamTag
        const matchTag = await Team.findOne({teamTag: tag}).exec();
        if (matchTag !== null) {
          tag = '';
        }
      } while (tag === '');

      const team = new Team({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
        teamTag: tag,
        players: [
          {
            playerId: player._id,
            isAdmin: true,
            AddedAt: Date.now()
          }
        ],
        createdAt: Date.now()
      }) // Create and save new team

      await team.save();
      return res.status(201).send({team: team});

    } catch (err) {
      logger.error(err);
      return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
    }
  });

  router.get('/team/info/:teamTag', verifyJWT, async (req, res) => {
    // res.sendFile(path.join(__dirname + './../client/build/index.html'));
    try {
      const team = await Team.findOne({teamTag: req.params.teamTag.toUpperCase()});
      if (team !== null) 
        return res.status(200).send({
          team: {
            name: team.name,
            teamTag: team.teamTag,
            avatar: team.avatar
          }
        });
      else {
        return res.status(404).send({error: 'TEAM_NOT_FOUND'});
      }
    } catch (err) {
      logger.error(err);
      return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
    }
  });

  router.get('/teams', verifyJWT, async (req, res) => {
    try {
      // Get teams where logged Player is
      let teams = await Team.find({"players.playerId": req.decoded._id}).lean().exec();
      for (let i in teams) {
        teams[i] = {
          name: teams[i].name,
          teamTag: teams[i].teamTag
        };
      }
      return res.status(200).send({teams})
    } catch (err) {
      return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'})
    }
  });

  router.post('/team/join', verifyJWT, async (req, res) => {
    try {
      const team = await Team.findOne({teamTag: req.body.teamTag.toUpperCase()});
      if (team === null) 
        throw 'TEAM_NOT_FOUND';
      else {
        // Check if Player is not already in Team
        team.players.map((teamPlayer) => {
          if (teamPlayer.playerId == req.decoded._id) {
            throw 'PLAYER_ALREADY_IN_TEAM';
          }
        })

        // Add Player to Team
        team.players.push({playerId: req.decoded._id, isAdmin: false, AddedAt: Date.now()})

        // Save Player in Team
        await team.save();
        return res.status(201).send({message: 'PLAYER_ADDED'});
      }
    } catch (err) {
      logger.error(err);
      if (err === 'PLAYER_ALREADY_IN_TEAM') 
        return res.status(409).send({error: err})
      else if (err === 'TEAM_NOT_FOUND') 
        return res.status(404).send({error: err})
      return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'})
    }
  });

  router.get('/team/getAllPlayers', verifyJWT, async (req, res) => {
    try {
      // Get teams where logged Player is
      const teamsObj = await Team.find({"players.playerId": req.decoded._id}).lean().exec();

      const playerIds = new Set();
      const playerTest = {};

      for (const teamObj of teamsObj) {
        playerTest[teamObj.name] = [];
        for (const playerObj of teamObj.players) {
          playerTest[teamObj.name].push(playerObj.playerId.toString());
          playerIds.add(playerObj.playerId.toString());
        }
      }

      const result = {};
      for (let name in playerTest) {
        result[name] = await Player.find({
          _id: [...playerTest[name]]
        }).lean().exec();
        result[name] = result[name].map((player) => {
          return {_id: player._id, firstName: player.firstName, lastName: player.lastName, email: player.email, avatar: player.avatar};
        });
      }
      return res.status(200).send(result);

    } catch (err) {
      res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
    }
  });

  return router
})()
