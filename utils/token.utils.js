const jwt = require('jsonwebtoken');
const express = require('express');
require("dotenv").config()

const createToken = (auth, user) => {
  return jwt.sign({
    email: user.email,
    _id: auth.id,
    fullName: user.fullName
  }, process.env.JWT_SECRET, {expiresIn: '10d'});
};

module.exports = {
  generateToken: (req, res, next) => {
    req.token = createToken(req.auth, req.user);
    const hour = 3600000;
    res.cookie('token', req.token, {
      maxAge: 365 * 24 * hour, // a year
      httpOnly: true
    });
    return next();
  },
  sendToken: (req, res) => {
    res.setHeader('x-auth-token', req.token);
    return res.status(200).send({email: req.user.email, fullName: req.user.fullName, _id: req.user._id, avatar: req.user.avatar});
  }
};
