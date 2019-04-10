const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const Player = require('./../models/player.model.js')
const fs = require('fs')
const {generateToken, sendToken} = require('../utils/token.utils');
const multer = require('multer');
const upload = multer({
  limits: {
    fileSize: 20000000
  },
  dest: './uploads/'
})

require("dotenv").config()

module.exports = (() => {
  const router = express.Router()

  router.post('/api/profile/avatar', upload.single('myAvatar'), (req, res) => {
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, async (err, decoded) => {
      if (decoded) {
        try {
          let user = await Player.findOne({email: decoded.email}).exec();
          if (req.file === null) {
            return res.status(400).send({error: 'MISSING_FILE'})
          }
          if (user) { // User exists
            const encImg = fs.readFileSync(req.file.path).toString('base64');
            user.avatar.data = Buffer.from(encImg, 'base64');
            user.avatar.contentType = req.file.mimetype;
            await user.save();
            fs.unlink(req.file.path, (err) => {
              console.log(err);
            })
            return res.status(200).send(user.avatar);
          } else { // User no longer exists
            res.clearCookie('token')
            return res.status(401).send({error: 'USER_NO_LONGER_EXISTS'})
          }
        } catch (err) {
          return res.status(400).send({error: err})
        }
      } else { // Token expired or no token
        res.clearCookie('token')
        return res.status(401).send({error: 'TOKEN_EXPIRED'})
      }
    })
  });

  router.get('/api/profile/avatar', (req, res) => {
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
      if (decoded) {
        Player.findOne({email: decoded.email}).exec().then((user) => {
          if (user) { // User exists
            return res.status(200).json(user);
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
  });

  return router
})()
