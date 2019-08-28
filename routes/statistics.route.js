const express = require('express');
const mongoose = require('mongoose');
const Player = require('../models/player.model.js');
const Match = require('../models/match.model.js');
const {verifyJWT, logger} = require('../middlewares');

require("dotenv").config();

module.exports = (() => {
  const router = express.Router();

  router.get('/winLossRatio', verifyJWT, async (req, res) => {
    let wins = 0;
    let losses = 0;
    const playerId = req.decoded._id;
  
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

      const matchCount = matchs.length;

      const isPlayer = p => (p && p._id == playerId);

      matchs.forEach(({player1: P1, player2: P2, player3: P3, player4: P4, score1, score2}) => {
        const [team1win, team2win] = [score1 > score2, score1 < score2];

        if ((
          (isPlayer(P1) || isPlayer(P2)) && team1win) || (
          (isPlayer(P3) || isPlayer(P4)) && team2win)
        )
          wins++;
        else if ((
          (isPlayer(P1) || isPlayer(P2)) && team2win) || (
          (isPlayer(P3) || isPlayer(P4)) && team1win)
        )
          losses++;
      });

      return res.status(200).send({wins, losses, matchCount});
    } catch (err) {
      logger.error(err);
      return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
    }
  });

  router.get('/goalsAnalysis', verifyJWT, async (req, res) => {
    try {
      const playerId = req.decoded._id;
      const matchs = await Match.find({
        $or: [
          {
            player1: playerId
          }, {
            player2: playerId
          }, {
            player3: playerId
          }, {
            player4: playerId
          }
        ]
      });

      let r = {
        attack: {
          goalCount: 0,
          minusCount: 0,
          betrayCount: 0,
          goalTotal: 0
        },
        defense: {
          goalCount: 0,
          minusCount: 0,
          betrayCount: 0,
          goalTotal: 0
        },
        unknown: {
          goalCount: 0,
          minusCount: 0,
          betrayCount: 0,
          goalTotal: 0
        },
        matchTotal: matchs.length
      };

      matchs.forEach(m => {
        m.history.forEach(g => {
          if (g.byPlayer == playerId) {
            switch (g.placement) {
              case 'A':
                r.attack.goalTotal++;
                if (g.isBetray) 
                  r.attack.betrayCount++;
                else {
                  if (g.deltaScore > 0) 
                    r.attack.goalCount++;
                  else 
                    r.attack.minusCount++;
                  }
                break;
              case 'D':
                r.defense.goalTotal++;
                if (g.isBetray) 
                  r.defense.betrayCount++;
                else {
                  if (g.deltaScore > 0) 
                    r.defense.goalCount++;
                  else 
                    r.defense.minusCount++;
                  }
                break;
              default:
                r.unknown.goalTotal++;
                if (g.isBetray) 
                  r.unknown.betrayCount++;
                else {
                  if (g.deltaScore > 0) 
                    r.unknown.goalCount++;
                  else 
                    r.unknown.minusCount++;
                  }
                break;
            }
          }
        });
      });

      return res.status(200).send({
        ...r
      });
    } catch (err) {
      logger.error(err);
      return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
    }
  });

  router.get('/goalsAveragePerMatch', verifyJWT, async (req, res) => {
    try {
      const playerId = req.decoded._id;
      const matchs = await Match.find({
        $or: [
          {
            player1: playerId
          }, {
            player2: playerId
          }, {
            player3: playerId
          }, {
            player4: playerId
          }
        ]
      });

      let goalCount = 0;
      let minusCount = 0;
      let betrayCount = 0;
      let goalAverage = 0;
      let minusAverage = 0;
      let betrayAverage = 0;
      let goalTotal = 0;
      let matchCount = matchs.length;

      matchs.forEach(m => {
        m.history.forEach(g => {
          if (g.byPlayer == playerId) {
            goalTotal++;
            if (g.isBetray) 
              betrayCount++;
            else {
              if (g.deltaScore > 0) 
                goalCount++;
              else 
                minusCount++;
              }
            }
        });
      });

      goalAverage = goalCount / goalTotal;
      minusAverage = minusCount / goalTotal;
      betrayAverage = betrayCount / goalTotal;

      return res.status(200).send({
        goalAverage,
        minusAverage,
        betrayAverage,
        goalCount,
        minusCount,
        betrayCount,
        goalTotal,
        matchCount
      });
    } catch (err) {
      logger.error(err);
      return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
    }
  });
  

  router.get('/DEBUGRENAMEPLACEMENT', verifyJWT, async (req, res) => {
    try {
      const matchs = await Match.find({});

      console.log(matchs);

      matchs.forEach(async m => {
        m.history.forEach(g => {
          if (g.placement === 'Attack') 
            g.placement = 'A';
          else if ((g.placement === 'Defense') || g.placement === 'Defence') 
            g.placement = 'D';
          }
        );
        await m.save();
      });

      return res.status(200).send({matchs});
    } catch (err) {
      logger.error(err);
      return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
    }
  });

  router.get('/placementCount', verifyJWT, async (req, res) => {
    try {
      const playerId = req.decoded._id;
      const matchs = await Match.find({
        $or: [
          {
            player1: playerId
          }, {
            player2: playerId
          }, {
            player3: playerId
          }, {
            player4: playerId
          }
        ]
      });

      let attackCount = 0;
      let defenseCount = 0;
      let unknownCount = 0;
      let matchCount = 0;

      matchs.forEach(async m => {
        matchCount++;
        m.history.filter(g => g.byPlayer == req.decoded._id)
          .forEach(g => {
            if (g.placement === 'A') 
              attackCount++;
            else if (g.placement === 'D') 
              defenseCount++;
            else 
              unknownCount++;
          }
        );
      });

      return res.status(200).send({
        attackCount,
        defenseCount,
        unknownCount,
        matchCount
      });
    } catch (err) {
      logger.error(err);
      return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
    }
  });


  router.get('/winStreak', verifyJWT, async (req, res) => {
    try {
      const playerId = req.decoded._id;
      const matchs = await Match.find({
        $or: [
          {
            player1: playerId
          }, {
            player2: playerId
          }, {
            player3: playerId
          }, {
            player4: playerId
          }
        ]
      });

      let winStreak = 0;
      let matchCount = matchs.length;

      const isPlayer = p => (p && p._id == playerId);
      
      matchs.reverse()
        // .some(m => {
        .some(({player1: P1, player2: P2, player3: P3, player4: P4, score1, score2}) => {
          const [team1win, team2win] = [score1 > score2, score1 < score2];

          if ((isPlayer(P1) || isPlayer(P2)) && team1win) {
            winStreak++;
            return false;
          } else if ((isPlayer(P3) || isPlayer(P4)) && team2win) {
            winStreak++;
            return false;
          }
          else {
            return true;
          }
      });

      return res.status(200).send({ winStreak, matchCount });
    } catch (err) {
      logger.error(err);
      return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
    }
  });


  router.get('/bestOpponents', verifyJWT, async (req, res) => {
    try {
      const playerId = req.decoded._id;
      const matchs = await Match.find({
        $or: [
          {
            player1: playerId
          }, {
            player2: playerId
          }, {
            player3: playerId
          }, {
            player4: playerId
          }
        ]
      });

      let opp = [];
      // Check if current player have specific id
      const isPlayer = p => (p && p._id == playerId);
      // Check if two players id are equal
      const isSame = (a, b) => (a._id.toString() === b._id.toString());

      matchs.forEach(({player1: P1, player2: P2, player3: P3, player4: P4, score1, score2}) => {
        const [team1win, team2win] = [score1 > score2, score1 < score2];

        if ((isPlayer(P1) || isPlayer(P2)) && team2win && P3) {
          const i = opp.findIndex(m => isSame(m, P3));
          if (i !== -1) opp[i].count += 1;
          else  opp = [ ...opp, { _id: P3._id, count: 1} ];
        }
        if ((isPlayer(P1) || isPlayer(P2)) && team2win && P4) {
          const i = opp.findIndex(m => isSame(m, P4));
          if (i !== -1) opp[i].count += 1;
          else  opp = [ ...opp, { _id: P4._id, count: 1} ];
        }
        if ((isPlayer(P3) || isPlayer(P4)) && team1win && P1) {
          const i = opp.findIndex(m => isSame(m, P1));
          if (i !== -1) opp[i].count += 1;
          else  opp = [ ...opp, { _id: P1._id, count: 1} ];
        }
        if ((isPlayer(P3) || isPlayer(P4)) && team1win && P2) {
          const i = opp.findIndex(m => isSame(m, P2));
          if (i !== -1) opp[i].count += 1;
          else  opp = [ ...opp, { _id: P2._id, count: 1} ];
        }
      });
      
      const highestCount = opp.reduce((max, o) => o.count > max ? o.count : max, 0);

      opp = opp.filter(o => o.count === highestCount);

      // Check if there is more than one opponent
      let bestOpponents = await Player.find({ 
        _id: opp.length === 1 ? 
          opp[0]._id : 
          opp.map(o => o._id)
      });

      // Get player(s) data
      bestOpponents = bestOpponents.map(({firstName, lastName, avatar}) => ({
        firstName,
        lastName,
        avatar,
        matchesLoss: highestCount
      }));

      return res.status(200).send(bestOpponents);
    } catch (err) {
      logger.error(err);
      return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
    }
  });


  router.get('/bestTeammates', verifyJWT, async (req, res) => {
    try {
      const playerId = req.decoded._id;
      const matchs = await Match.find({
        $or: [
          {
            player1: playerId
          }, {
            player2: playerId
          }, {
            player3: playerId
          }, {
            player4: playerId
          }
        ]
      });

      let mate = [];
      // Check if current player have specific id
      const isPlayer = p => (p && p._id == playerId);
      // Check if two players id are equal
      const isSame = (a, b) => (a._id.toString() === b._id.toString());

      matchs.forEach(({player1: P1, player2: P2, player3: P3, player4: P4, score1, score2}) => {
        const [team1win, team2win] = [score1 > score2, score1 < score2];

        if (isPlayer(P1) && team1win && P2) {
          const i = mate.findIndex(m => isSame(m, P2));
          if (i !== -1) mate[i].count += 1;
          else  mate = [ ...mate, { _id: P2._id, count: 1} ];
        }
        else if (isPlayer(P2) && team1win && P1) {
          const i = mate.findIndex(m => isSame(m, P1));
          if (i !== -1) mate[i].count += 1;
          else  mate = [ ...mate, { _id: P1._id, count: 1} ];
        }
        else if (isPlayer(P3) && team2win && P4) {
          const i = mate.findIndex(m => isSame(m, P4));
          if (i !== -1) mate[i].count += 1;
          else  mate = [ ...mate, { _id: P4._id, count: 1} ];
        }
        else if (isPlayer(P4) && team2win && P3) {
          const i = mate.findIndex(m => isSame(m, P3));
          if (i !== -1) mate[i].count += 1;
          else  mate = [ ...mate, { _id: P3._id, count: 1} ];
        }
      });
      
      const highestCount = mate.reduce((max, o) => o.count > max ? o.count : max, 0);

      mate = mate.filter(o => o.count === highestCount);

      // Check if there is more than one opponent
      let bestTeammates = await Player.find({ 
        _id: mate.length === 1 ? 
          mate[0]._id : 
          mate.map(o => o._id)
      });

      // Get player(s) data
      bestTeammates = bestTeammates.map(({firstName, lastName, avatar}) => ({
        firstName,
        lastName,
        avatar,
        matchesWon: highestCount
      }));

      return res.status(200).send(bestTeammates);
    } catch (err) {
      logger.error(err);
      return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
    }
  });


  router.get('/weekSummary', verifyJWT, async (req, res) => {
    try {
      const playerId = req.decoded._id;
      const limitPastDate = new Date();
      const limitActualDate = new Date();
      const weekdays = [
        {
          abrev: 'D',
          fullname: 'Dimanche'
        },
        {
          abrev: 'L',
          fullname: 'Lundi'
        },
        {
          abrev: 'M',
          fullname: 'Mardi'
        },
        {
          abrev: 'M',
          fullname: 'Mercredi'
        },
        {
          abrev: 'J',
          fullname: 'Jeudi'
        },
        {
          abrev: 'V',
          fullname: 'Vendredi'
        },
        {
          abrev: 'S',
          fullname: 'Samedi'
        }
      ];
      
      const DAYS_BEFORE = 7;
      // Set limit date to one week ago
      limitPastDate.setDate(limitPastDate.getDate() - DAYS_BEFORE);
      // Set dates to midnight
      limitPastDate.setHours(0, 0, 0, 0);
      limitActualDate.setHours(0, 0, 0, 0);
      
      const matchs = await Match.find({
        $and: [
          {
            createdAt: { $gt: limitPastDate, $lt: limitActualDate }
          },
          {
            $or: [
              {
                player1: playerId
              }, {
                player2: playerId
              }, {
                player3: playerId
              }, {
                player4: playerId
              }
            ]
          }
        ]
      });

      let weekSummary = [];

      const isSameDay = (d1, d2) => (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      );

      const isPlayer = p => (p && p._id == playerId);

      const isMatchWon = ({player1: P1, player2: P2, player3: P3, player4: P4, score1, score2}) => {
        const [team1win, team2win] = [score1 > score2, score1 < score2];
        return (
          (isPlayer(P1) || isPlayer(P2)) && team1win) || (
          (isPlayer(P3) || isPlayer(P4)) && team2win
        );
      }

      limitActualDate.setDate(limitActualDate.getDate() - 1);

      // For each day
      for (let d = limitActualDate; d >= limitPastDate; d.setDate(d.getDate() - 1)) {
        let dayMatchs = matchs.filter(m => isSameDay(m.createdAt, d));

        let wins = 0;
        let losses = 0;
        dayMatchs.forEach(m => {
          wins += (isMatchWon(m) ? 1 : 0);
          losses += (!isMatchWon(m) ? 1 : 0);
        });

        weekSummary = [ 
          ...weekSummary, 
          {
            wins,
            losses,
            day: weekdays[d.getDay()].abrev
          }
        ];
      }

      return res.status(200).send(weekSummary.reverse());
    } catch (err) {
      logger.error(err);
      return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
    }
  });


  return router;
})()
