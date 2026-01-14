const express = require('express');
const path = require('path');

const app = express();

// Serve static files from parent directory (root) with proper caching headers
app.use(express.static(path.join(__dirname, '..'), {
  maxAge: '1h',
  etag: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    } else if (filePath.endsWith('.js')) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    }
  }
}));

// SPA fallback: serve index.html only for non-file requests
app.use((req, res) => {
  // Check if the request looks like it's for a file (has an extension)
  if (path.extname(req.path)) {
    // It's a file request but wasn't found by static middleware
    return res.status(404).send('File not found');
  }
  // It's a route request, serve index.html for SPA routing
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

module.exports = app;
