/**
 * Jadwal XII TJKT 2 - Server
 * 
 * Simple Express server with:
 * - Static file serving
 * - Firebase Realtime Database (REST API)
 * - Assignments API
 * - Cron jobs for cleanup
 */

require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// API Routes
app.use('/api/assignments', require('./routes/assignments'));

// Health check
app.get('/api/health', (req, res) => {
  const db = require('./lib/firebase');
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: db.isConfigured() ? 'configured' : 'not configured'
  });
});

// Manual maintenance trigger
app.post('/api/maintenance', async (req, res) => {
  const { runMaintenance } = require('./cron/assignmentCron');
  const result = await runMaintenance();
  res.json({ success: true, ...result });
});

// Static files
app.use(express.static(path.join(__dirname, '.')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server: http://localhost:${PORT}`);
    
    // Start cron jobs
    const { initCronJobs } = require('./cron/assignmentCron');
    initCronJobs();
  });
}

module.exports = app;
