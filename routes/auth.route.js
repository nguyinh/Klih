const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const Player = require('./../models/player.model.js')
const fs = require('fs')
const {generateToken, sendToken} = require('../utils/token.utils');

require("dotenv").config()

module.exports = (() => {
  const router = express.Router()

  router.post('/api/connect', function(req, res) {
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
      if (decoded) {
        Player.findOne({email: decoded.email}).exec().then((user) => {
          if (user) { // User exists
            return res.status(200).json({
              email: decoded.email,
              avatar: user.avatar,
              _id: user._id,
              fullName: (
                user.fullName
                ? user.fullName
                : user.firstName + ' ' + user.lastName),
              token: req.cookies.token
            })
          } else { // User no longer exists
            res.clearCookie('token')
            return res.status(401).send({error: 'USER_NO_LONGER_EXISTS'})
          }
        })

      } else { // Token expired or no token
        res.clearCookie('token')
        return res.status(401).send({error: 'TOKEN_EXPIRED'})
      }
    })
  })

  router.post('/api/signup', function(req, res, next) {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        console.log(err);
        return res.json({message: err, error: 'INTERNAL_SERVER_ERROR'})
      } else {
        Player.findOne({email: req.body.email}).exec().then((user) => {
          if (user) { // User already exists
            return res.status(409).json({error: 'USER_ALREADY_EXISTS'})
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
              // TODO: Add isAdmin field
              // TODO: Add stats
            }) // Create and save new user

            user.save().then((result) => {
              // console.log(generateToken(req, res, next));
              const JWTToken = jwt.sign({
                email: user.email,
                _id: user._id
              }, process.env.JWT_SECRET, {expiresIn: '1y'});
              const hour = 3600000;
              res.cookie('token', JWTToken, {
                maxAge: 365 * 24 * hour, // a year
                httpOnly: true
              })

              return res.status(201).json({
                email: user.email,
                fullName: (
                  user.fullName
                  ? user.fullName
                  : user.firstName + ' ' + user.lastName),
                _id: user._id
              })
            }).catch((error) => {
              console.log(error)
              return res.status(500).json({error: 'INTERNAL_SERVER_ERROR'})
            })
          }
        }).catch(err => {
          console.log(err)
          return res.status(500).json({error: 'INTERNAL_SERVER_ERROR'})
        })
      }
    })
  })

  router.post('/api/signin', function(req, res) {
    Player.findOne({email: req.body.email}).exec().then((user) => {
      if (user) { // User exists
        bcrypt.compare(req.body.password, user.password, function(err, result) {
          if (err) { // If password don't match
            return res.status(401).json({error: 'WRONG_PASSWORD'});
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
            return res.status(200).json({
              email: user.email,
              avatar: user.avatar,
              fullName: (
                user.fullName
                ? user.fullName
                : user.firstName + ' ' + user.lastName),
              _id: user._id
            })
          }
          return res.status(401).json({error: 'WRONG_PASSWORD'});
        });
      } else { // User doesn't exists
        return res.status(401).json({error: 'USER_NOT_FOUND'})
      }
    })

  })

  router.post('/api/logout', function(req, res) {
    res.clearCookie('token')
    return res.status(202).send({message: 'Logout successful'})
  })

  return router
})()
