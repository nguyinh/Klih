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
            return res.status(200).json({email: decoded.email, fullName: user.fullName, token: req.cookies.token})
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
          } else { // User doesn't exists for now
            const user = new Player({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              createdAt: Date.now(),
              updatedAt: Date.now(),
              lastConnectionAt: Date.now()
              // TODO: Add isAdmin field
              // TODO: Add stats
              // a.img.data = fs.readFileSync(imgPath);
              // a.img.contentType = 'image/png';
              // res.contentType(user.avatar.contentType)
              // res.send(user.avatar.data)
            }) // Create and save new user

            user.save().then((result) => {
              // console.log(generateToken(req, res, next));
              const JWTToken = jwt.sign({
                email: user.email,
                _id: user._id
              }, process.env.JWT_SECRET, {expiresIn: '10d'})
              res.cookie('token', JWTToken, {
                expiresIn: 90000,
                httpOnly: true
              })

              return res.status(201).json({success: 'New user has been created', token: JWTToken})
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
            }, process.env.JWT_SECRET, {expiresIn: '10d'})
            res.clearCookie('token')
            res.cookie('token', JWTToken, {
              expiresIn: 90000,
              httpOnly: true
            })
            return res.status(200).json({message: 'Login successful', token: JWTToken})
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
