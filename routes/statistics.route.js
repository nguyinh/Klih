const express = require('express');
const mongoose = require('mongoose');
const Player = require('../models/player.model.js');
const Match = require('../models/match.model.js');
const {verifyJWT, logger} = require('../middlewares');

require("dotenv").config();

module.exports = (() => {
  const router = express.Router()

  router.get('/statistics/winLossRatio', verifyJWT, async (req, res) => {
    let matchWins = 0;
    let matchLosses = 0;
    let matchCount = 0;
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

      matchs.forEach(m => {
        matchCount++;
        if (m.player1 == req.decoded._id || m.player2 == req.decoded._id) {
          if (m.score1 > m.score2) 
            matchWins++;
          else if (m.score1 < m.score2) 
            matchLosses++;
          }
        else if (m.player3 == req.decoded._id || m.player4 == req.decoded._id) {
          if (m.score2 > m.score1) 
            matchWins++;
          else if (m.score2 < m.score1) 
            matchLosses++;
          }
        });

      return res.status(200).send({wins: matchWins, losses: matchLosses, matchCount: matchCount});
    } catch (err) {
      logger.error(err);
      return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
    }
  });

  router.get('/statistics/goalsAnalysis', verifyJWT, async (req, res) => {
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
        matchTotal: 0
      };

      matchs.forEach(m => {
        r.matchTotal++;
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

  router.get('/statistics/goalsAveragePerMatch', verifyJWT, async (req, res) => {
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
      let matchTotal = 0;

      matchs.forEach(m => {
        matchTotal++;
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
        matchTotal
      });
    } catch (err) {
      logger.error(err);
      return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
    }
  });

  // router.get('/statistics/goalsCount', verifyJWT, async (req, res) => {
  //   try {
  //     const playerId = req.decoded._id;
  //     const matchs = await Match.find({
  //       $or: [
  //         {
  //           player1: playerId
  //         }, {
  //           player2: playerId
  //         }, {
  //           player3: playerId
  //         }, {
  //           player4: playerId
  //         }
  //       ]
  //     });
  //
  //     let goalCount = 0;
  //     let minusCount = 0;
  //     let betrayCount = 0;
  //
  //     matchs.forEach(m => {
  //       m.history.forEach(g => {
  //         if (g.byPlayer == playerId) {
  //           if (g.isBetray)
  //             betrayCount++;
  //           else {
  //             if (g.deltaScore > 0)
  //               goalCount++;
  //             else
  //               minusCount++;
  //             }
  //           }
  //       });
  //     });
  //
  //     return res.status(200).send({goalCount, minusCount, betrayCount});
  //   } catch (err) {
  //     logger.error(err);
  //     return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
  //   }
  // });

  // router.get('/statistics/goalsCountByPlacement', verifyJWT, async (req, res) => {
  //   try {
  //     const playerId = req.decoded._id;
  //     const matchs = await Match.find({
  //       $or: [
  //         {
  //           player1: playerId
  //         }, {
  //           player2: playerId
  //         }, {
  //           player3: playerId
  //         }, {
  //           player4: playerId
  //         }
  //       ]
  //     });

  //     let attackCount = {
  //       goalAverage: 0,
  //       minusAverage: 0,
  //       betrayAverage: 0,
  //       goalcount: 0
  //     };

  //     let defenseCount = {
  //       goalAverage: 0,
  //       minusAverage: 0,
  //       betrayAverage: 0,
  //       goalcount: 0
  //     };

  //     matchs.forEach(m => {
  //       m.history.forEach(g => {
  //         if (g.byPlayer == playerId) {
  //           if (g.placement === 'A') {
  //             attackCount.goalcount++;
  //             if (g.isBetray) 
  //               attackCount.betrayAverage++;
  //             else {
  //               if (g.deltaScore > 0) 
  //                 attackCount.goalAverage++;
  //               else 
  //                 attackCount.minusAverage++;
  //               }
  //             } else if (g.placement === 'D') {
  //             defenseCount.goalcount++;
  //             if (g.isBetray) 
  //               defenseCount.betrayAverage++;
  //             else {
  //               if (g.deltaScore > 0) 
  //                 defenseCount.goalAverage++;
  //               else 
  //                 defenseCount.minusAverage++;
  //               }
  //             }
  //         }
  //       });
  //     });

  //     // goalAverage /= matchCount;
  //     // minusAverage /= matchCount;
  //     // betrayAverage /= matchCount;

  //     return res.status(200).send({attackCount, defenseCount});
  //   } catch (err) {
  //     logger.error(err);
  //     return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
  //   }
  // });

  router.get('/statistics/DEBUGRENAMEPLACEMENT', verifyJWT, async (req, res) => {
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

  return router;
})()
