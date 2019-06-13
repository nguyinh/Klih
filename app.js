const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");

const cors = require('cors');
const app = express();
const server = require('http').Server(app);
const io = require('./socket')(server);
const {logger, redirectSecure, jwtVerify} = require('./middlewares');
const authRoute = require('./routes/auth.route.js');
const matchRoute = require('./routes/match.route.js');
const teamRoute = require('./routes/team.route.js');
const oauthRoute = require('./routes/oauth.route.js');
const profileRoute = require('./routes/profile.route.js');
const playingRoute = require('./routes/playingMatch.route.js');
const playerRoute = require('./routes/player.route.js');

require("dotenv").config()

const corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token', 'Set-Cookie']
};
app.use(cors(corsOption));
if (process.env.ENV !== 'dev') {
  app.use(redirectSecure);
}

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(jwtVerify);
app.use((req, res, next) => {
  const whitelist = ['http://localhost:3000', 'http://klih.herokuapp.com'];
  const origin = req.headers.origin;
  if (whitelist.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  // res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control, X-HTTP-Method-Override");
  res.header('Access-Control-Allow-Methods', '*');
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

const mongoURL = process.env.MONGODB_URI || "mongodb://localhost/klih"
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  bufferCommands: false
})

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
app.use('/api', authRoute);
app.use('/api', matchRoute);
app.use('/api', teamRoute);
app.use('/api', oauthRoute);
app.use('/api', profileRoute);
app.use('/api', playingRoute);
app.use('/api', playerRoute);

// Put all API endpoints under '/api'
app.get('/api/*', (req, res) => {
  res.json('Welcome to Klih !');
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 8116;

if (process.env.ENV === 'dev') 
  server.listen(port, '0.0.0.0'); // app.listen(port, '0.0.0.0');
else 
  server.listen(port);

logger.info(`[Express] Server listening on ${port}`);
