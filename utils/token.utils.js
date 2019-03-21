const jwt = require('jsonwebtoken');
const express = require('express');
require("dotenv").config()

const createToken = (auth, user) => {
  console.log(user);
  return jwt.sign({
    email: user.email,
    id: auth.id
  }, process.env.JWT_SECRET, {
    expiresIn: 60 * 120
  });
};

module.exports = {
  generateToken: (req, res, next) => {
    req.token = createToken(req.auth, req.user);
    res.cookie('token', req.token, {
      expiresIn: 90000,
      httpOnly: true
    })
    return next();
  },
  sendToken: (req, res) => {
    res.setHeader('x-auth-token', req.token);

    return res.status(200).send({email: req.user.email, fullName: req.user.fullName, _id: req.user._id});
  }
};
