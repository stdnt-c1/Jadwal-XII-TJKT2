const express = require('express');
const path = require('path');

const app = express();

// Serve static files from parent directory (root)
app.use(express.static(path.join(__dirname, '..')));

// Fallback route to serve index.html for any unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

module.exports = app;
