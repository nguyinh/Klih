const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const log4js = require('log4js');

const authRoute = require('./routes/auth.route.js');
const matchRoute = require('./routes/match.route.js');
const teamRoute = require('./routes/team.route.js');

const app = express();
require("dotenv").config()

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

const logger = log4js.getLogger();
logger.level = 'all';

const mongoURL = process.env.MONGODB_URI || "mongodb://localhost/klih"
mongoose.connect(mongoURL, {useNewUrlParser: true})

const db = mongoose.connection;
db.on('error', () => {
  logger.error('[MongoDB] Error during connection')
});
db.once('open', () => {
  logger.info(`[MongoDB] Connected to ${mongoURL}`);
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
// Enable API REST
app.use('/', authRoute);
app.use('/', matchRoute);
app.use('/', teamRoute);

// Put all API endpoints under '/api'
app.get('/api/*', (req, res) => {
  res.json('Welcome to Klih !')
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 8116;
app.listen(port);

logger.info(`[Express] Server listening on ${port}`);
