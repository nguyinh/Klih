const express = require('express')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const path = require('path');
const Team = require('../models/team.model.js')
const Player = require('../models/player.model.js')
const logger = require('log4js').getLogger();

require("dotenv").config()

module.exports = (() => {
  const router = express.Router()

  router.post('/api/team', (req, res) => {
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
      if (decoded) {
        Player.findOne({_id: decoded._id}).exec().then(async (player) => {
          var tag = '';
          var available = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          do {
            for (var i = 0; i < 6; i++) // Create random teamTag
              tag += available.charAt(Math.floor(Math.random() * available.length));
            
            // Search for other occurencies of teamTag
            await Team.findOne({teamTag: tag}).exec().then((matchTag) => {
              if (matchTag !== null) {
                tag = '';
              }
            }).catch((err) => {
              logger.error(err)
            });
          } while (tag === '');

          const team = new Team({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
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

          // TODO: Add TeamId to Players ?

          team.save().then((result) => {
            return res.status(201).json({team: team})
          }).catch((error) => {
            logger.error(error)
            return res.status(500).json({error: 'INTERNAL_SERVER_ERROR'})
          })
        }).catch((err) => {
          logger.error(err);
          return res.status(500).json({error: 'INTERNAL_SERVER_ERROR'})
        });

      } else { // Token expired or no token

        // TODO: Ask for connection

        res.clearCookie('token')
        return res.status(401).send({error: 'TOKEN_EXPIRED'})
      }
    })
  })

  router.get('/api/team/info/:teamTag', (req, res) => {
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
      if (decoded) {
        // res.sendFile(path.join(__dirname + './../client/build/index.html'));
        Team.findOne({teamTag: req.params.teamTag.toUpperCase()}).then(async (team) => {
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
        }).catch((err) => {
          logger.error(err);
          return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
        });

      } else { // Token expired or no token

        // TODO: Ask for connection

        res.clearCookie('token')
        return res.status(401).send({error: 'TOKEN_EXPIRED'})
      }
    })
  });

  router.get('/api/team/old/:teamTag', (req, res) => {
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
      if (decoded) {
        // res.sendFile(path.join(__dirname + './../client/build/index.html'));
        Team.findOne({teamTag: req.params.teamTag.toUpperCase()}).then(async (team) => {
          if (team !== null) 
            return res.status(200).send({team: team});
          else {
            return res.status(404).send({error: 'TEAM_NOT_FOUND'});
          }
        }).catch((err) => {
          logger.error(err);
          return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
        });

      } else { // Token expired or no token

        // TODO: Ask for connection

        res.clearCookie('token')
        return res.status(401).send({error: 'TOKEN_EXPIRED'})
      }
    })
  });

  router.post('/api/team/join', (req, res) => {
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
      if (decoded) {
        // Team.findOne({'players.playerId': decoded._id, _id: teamId, 'players.isAdmin': true}).then((player) => {
        Team.findOne({teamTag: req.body.teamTag.toUpperCase()}).then(async (team) => {
          if (team === null) 
            throw 'TEAM_NOT_FOUND'
          else {
            // Check if Player is not already in Team
            team.players.map((teamPlayer) => {
              if (teamPlayer.playerId == decoded._id) {
                throw 'PLAYER_ALREADY_IN_TEAM';
              }
            })

            // Add Player to Team
            team.players.push({playerId: decoded._id, isAdmin: false, AddedAt: Date.now()})

            // Save Player in Team
            team.save().then((result) => {
              return res.status(201).send({message: 'PLAYER_ADDED'})
            }).catch((err) => {
              logger.error(err)
              return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'})
            });

          }
        }).catch((err) => {
          logger.error(err);
          if (err === 'PLAYER_ALREADY_IN_TEAM') 
            return res.status(409).send({error: err})
          else if (err === 'TEAM_NOT_FOUND') 
            return res.status(404).send({error: err})
          return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'})
        });
      } else { // Token expired or no token

        // TODO: Ask for connection

        res.clearCookie('token')
        return res.status(401).send({error: 'TOKEN_EXPIRED'})
      }
    })
  });

  router.get('/api/team/getAllPlayers', (req, res) => {
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, async (err, decoded) => {
      if (decoded) {
        try {
          // Get teams where logged Player is
          const teamsObj = await Team.find({"players.playerId": decoded._id}).lean().exec();

          const playerIds = new Set();
          const playerTest = {}

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
              // return player;
            });
          }
          // TODO: Add picture
          return res.status(200).send(result);

        } catch (err) {
          res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
        }

      } else { // Token expired or no token

        // TODO: Ask for connection

        res.clearCookie('token')
        return res.status(401).send({error: 'TOKEN_EXPIRED'})
      }
    })
  });

  return router
})()
