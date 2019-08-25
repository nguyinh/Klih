const express = require('express')
const mongoose = require('mongoose')
const Team = require('../models/team.model.js')
const Player = require('../models/player.model.js')
const multer = require('multer');
const upload = multer({
  limits: {
    fileSize: 20000000
  },
  dest: './uploads/'
});
const fs = require('fs');
const sharp = require('sharp');
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
            player: player._id,
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
      let teams = await Team.find({"players.player": req.decoded._id}).lean().exec();
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
          if (teamPlayer.player == req.decoded._id) {
            throw 'PLAYER_ALREADY_IN_TEAM';
          }
        })

        // Add Player to Team
        team.players.push({player: req.decoded._id, isAdmin: false, AddedAt: Date.now()})

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
      const teamsObj = await Team.find({"players.player": req.decoded._id}).lean().exec();

      const players = new Set();
      const playerTest = {};

      for (const teamObj of teamsObj) {
        playerTest[teamObj.name] = [];
        for (const playerObj of teamObj.players) {
          playerTest[teamObj.name].push(playerObj.player.toString());
          players.add(playerObj.player.toString());
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

  router.get('/team/getTeams', verifyJWT, async (req, res) => {
    try {
      // Get teams where logged Player is
      const teams = await Team.find({"players.player": req.decoded._id}).populate('players.player').exec();
      const result = teams.map(t => {
        // Avoid deleted players
        // TODO: DELETE DELETED PLAYERS FROM TEAMS
        t.players = t.players.filter(p => p.player !== null);
        return {
          ...t.toObject(),
          players: t.players.map(({player: {firstName, lastName, avatar,_id}, isAdmin}) => (
            {
              firstName,
              lastName,
              avatar,
              isAdmin,
              actualPlayer: req.decoded._id == _id
            }
          ))
        };
      });

      return res.status(200).send(result);

    } catch (err) {
      logger.error(err);
      res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
    }
  });

  router.post('/teams/avatar', verifyJWT, upload.single('teamAvatar'), async (req, res) => {
    try {
      const { teamId } = req.query;
      const { _id: playerId } = req.decoded

      if (!teamId)
        return res.status(400).send({error: 'MISSING_PARAMETERS'});
      if (!req.file)
        return res.status(400).send({error: 'MISSING_FILE'})
      
      const team = await Team.findOne({_id: teamId}).exec();

      if (!team) {
        return res.status(404).send({error: 'TEAM_NOT_FOUND'})
      }

      const isPlayerAdmin = team.players.some(p => {
        return p.player == playerId && p.isAdmin;
      });

      if (!isPlayerAdmin)
        return res.status(403).send({error: 'PLAYER_NOT_ADMIN'})

      const resizedImg = await sharp(req.file.path).resize(300, 300).toBuffer();
      team.avatar.data = Buffer.from(resizedImg.toString('base64'), 'base64');
      team.avatar.contentType = req.file.mimetype;
      await team.save();
      fs.unlink(req.file.path, (err) => {
        console.log(err);
      })

      return res.status(200).send(team.avatar);
    } catch (err) {
      logger.error(err);
      fs.unlink(req.file.path, (fsErr) => {
        logger.error(fsErr);
      })
      res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
    }
  });

  return router
})()
