/**
 * Firebase Realtime Database - Simple HTTP Helper
 * 
 * Uses legacy REST API with database secret for authentication
 * No complex SDK required - just HTTPS requests
 * 
 * Environment Variables:
 * - FB_DB_URL: Realtime Database URL (e.g., https://your-db.firebaseio.com/)
 * - FB_DB_SECRET: Database secret for authentication
 */

const https = require('https');
const http = require('http');

const FB_DB_URL = process.env.FB_DB_URL?.replace(/\/$/, '') || '';
const FB_DB_SECRET = process.env.FB_DB_SECRET || '';

/**
 * Make HTTP request to Firebase Realtime Database
 */
function firebaseRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    if (!FB_DB_URL) {
      return reject(new Error('FB_DB_URL not configured'));
    }

    const url = new URL(`${FB_DB_URL}${path}.json`);
    if (FB_DB_SECRET) {
      url.searchParams.append('auth', FB_DB_SECRET);
    }

    const options = {
      method,
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const protocol = url.protocol === 'https:' ? https : http;
    
    const req = protocol.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = body ? JSON.parse(body) : null;
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(json);
          } else {
            reject(new Error(json?.error || `HTTP ${res.statusCode}`));
          }
        } catch (e) {
          reject(new Error(`Parse error: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

/**
 * Firebase Realtime Database operations
 */
const db = {
  /**
   * GET - Read data from path
   */
  async get(path) {
    return firebaseRequest('GET', path);
  },

  /**
   * PUT - Write/replace data at path
   */
  async set(path, data) {
    return firebaseRequest('PUT', path, data);
  },

  /**
   * POST - Push new data (auto-generate key)
   */
  async push(path, data) {
    return firebaseRequest('POST', path, data);
  },

  /**
   * PATCH - Update specific fields
   */
  async update(path, data) {
    return firebaseRequest('PATCH', path, data);
  },

  /**
   * DELETE - Remove data at path
   */
  async remove(path) {
    return firebaseRequest('DELETE', path);
  },

  /**
   * Check if database is configured
   */
  isConfigured() {
    return Boolean(FB_DB_URL);
  }
};

module.exports = db;
