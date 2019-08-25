const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const Player = require('./../models/player.model.js')
const fs = require('fs');
const {generateToken, sendToken} = require('../utils/token.utils');
const multer = require('multer');
const upload = multer({
  limits: {
    fileSize: 20000000
  },
  dest: './uploads/'
});
const sharp = require('sharp');
const {verifyJWT, logger} = require('../middlewares');

require("dotenv").config()

module.exports = (() => {
  const router = express.Router()

  router.post('/profile/avatar', verifyJWT, upload.single('myAvatar'), async (req, res) => {
    try {
      let user = await Player.findOne({email: req.decoded.email}).exec();
      if (req.file === null) {
        return res.status(400).send({error: 'MISSING_FILE'})
      }
      if (user) { // User exists
        // const encImg = fs.readFileSync(req.file.path).toString('base64');
        const resizedImg = await sharp(req.file.path).resize(300, 300).toBuffer();
        // console.log(fs.readFileSync(req.file.path));
        // console.log(data);
        user.avatar.data = Buffer.from(resizedImg.toString('base64'), 'base64');
        // user.avatar.data = Buffer.from(encImg, 'base64');
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
  });

  router.get('/profile/avatar', verifyJWT, async (req, res) => {
    try {
      const user = await Player.findOne({email: req.decoded.email}).exec();
      if (user) { // User exists
        return res.status(200).send(user);
      } else { // User no longer exists
        res.clearCookie('token');
        return res.status(401).send({error: 'USER_NO_LONGER_EXISTS'})
      }
    } catch (err) {
      logger.error(err);
      return res.status(500).send({error: 'INTERNAL_SERVER_ERROR'})
    }
  });

  return router
})()
