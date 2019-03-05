const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
require("dotenv").config()


const mongoURL = process.env.MONGODB_URI || "mongodb://localhost/klih"
mongoose.connect(mongoURL, {
  useNewUrlParser: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, '[MongoDB] Error during connection'));
db.once('open', function() {
  console.log('\x1b[36m%s\x1b[0m', `[MongoDB] Connected to {port}`);
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

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

console.log('\x1b[36m%s\x1b[0m', `[Express] Server listening on ${port}`);