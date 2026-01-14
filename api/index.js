const express = require('express');
const path = require('path');

const app = express();

// Only serve index.html for HTML routes - let Vercel handle static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'), {
    headers: {
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'Content-Type': 'text/html; charset=utf-8'
    }
  });
});

// Catch-all for SPA routing - serve index.html for any non-file routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'), {
    headers: {
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'Content-Type': 'text/html; charset=utf-8'
    }
  });
});

module.exports = app;
