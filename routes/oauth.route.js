const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const Player = require('./../models/player.model.js')
const fs = require('fs')

const {generateToken, sendToken} = require('../utils/token.utils');
const passport = require('passport');
const axios = require('axios');
const config = require('../config');
require('../passport')();

require("dotenv").config()

module.exports = (() => {
  const router = express.Router()

  router.route('/auth/facebook').post(passport.authenticate('facebook-token', {session: false}), (req, res, next) => {
    if (!req.user) {
      return res.send(401, 'User Not Authenticated');
    }
    req.auth = {
      id: req.user.id
    };

    next();
  }, generateToken, sendToken);

  router.route('/auth/google').post(passport.authenticate('google-token', {session: false}), (req, res, next) => {
    if (!req.user) {
      return res.send(401, 'User Not Authenticated');
    }
    req.auth = {
      id: req.user.id
    };

    next();
  }, generateToken, sendToken);

  return router
})()
