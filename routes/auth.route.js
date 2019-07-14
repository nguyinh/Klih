const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const Player = require('./../models/player.model.js')
const fs = require('fs')
const {generateToken, sendToken} = require('../utils/token.utils');
const {verifyJWT, logger} = require('../middlewares');

require("dotenv").config()

module.exports = (() => {
  const router = express.Router();

  router.post('/connect', verifyJWT, async (req, res) => {
    try {
      const user = await Player.findOne({email: req.decoded.email});
      if (user) { // User exists
        return res.status(200).send({
          email: req.decoded.email,
          avatar: user.avatar,
          _id: user._id,
          fullName: (
            user.fullName
            ? user.fullName
            : user.firstName + ' ' + user.lastName),
          token: req.cookies.token
        });
      } else { // User no longer exists
        res.clearCookie('token');
        return res.status(401).send({error: 'USER_NO_LONGER_EXISTS'});
      }
    } catch (err) {
      logger.error(err);
      return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
    }
  });

  router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        console.log(err);
        return res.send({message: err, error: 'INTERNAL_SERVER_ERROR'});
      } else {
        try {
          const user = await Player.findOne({email: req.body.email}).exec();
          if (user) { // User already exists
            return res.status(409).send({error: 'USER_ALREADY_EXISTS'});
          } else { // User is not in database
            let avatar = {
              data: fs.readFileSync('./image.png'),
              contentType: 'image/png'
            };

            const user = new Player({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              createdAt: Date.now(),
              updatedAt: Date.now(),
              lastConnectionAt: Date.now(),
              avatar: avatar
            }) // Create and save new user

            const result = await user.save();

            const JWTToken = jwt.sign({
              email: user.email,
              _id: user._id
            }, process.env.JWT_SECRET, {expiresIn: '1y'});
            const hour = 3600000;
            res.cookie('token', JWTToken, {
              maxAge: 365 * 24 * hour, // a year
              httpOnly: true
            });

            return res.status(201).send({
              email: user.email,
              fullName: (
                user.fullName
                ? user.fullName
                : user.firstName + ' ' + user.lastName),
              _id: user._id
            });
          }
        } catch (err) {
          logger.error(err);
          return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'});
        }
      }
    });
  });

  router.post('/signin', async function(req, res) {
    try {
      const user = await Player.findOne({email: req.body.email}).exec();
      if (user) { // User exists
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (err) { // If password don't match
            return res.status(401).send({error: 'WRONG_PASSWORD'});
          }
          if (result) {
            const JWTToken = jwt.sign({
              email: user.email,
              _id: user._id
            }, process.env.JWT_SECRET, {expiresIn: '1y'})
            res.clearCookie('token');
            const hour = 3600000;
            res.cookie('token', JWTToken, {
              maxAge: 365 * 24 * hour, // a year
              httpOnly: true
            })
            return res.status(200).send({
              email: user.email,
              avatar: user.avatar,
              fullName: (
                user.fullName
                ? user.fullName
                : user.firstName + ' ' + user.lastName),
              _id: user._id
            })
          }
          // return res.status(401).send({error: 'WRONG_PASSWORD'});
        });
      } else { // User doesn't exists
        // return res.status(401).send({error: 'USER_NOT_FOUND'})
      }
    } catch (err) {
      logger.error(err);
      return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'})
    }
  });

  router.post('/logout', function(req, res) {
    res.clearCookie('token');
    return res.status(202).send({message: 'Logout successful'});
  });

  return router;
})()
