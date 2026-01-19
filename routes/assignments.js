/**
 * Assignments API Routes
 * 
 * Simple CRUD using Firebase Realtime Database REST API
 * 
 * Assignment Schema:
 * {
 *   subject: string
 *   title: string  
 *   teacher: string
 *   details: string
 *   dateGiven: ISO string
 *   deadline: ISO string
 *   status: 'active' | 'expired' | 'archived'
 *   createdAt: ISO string
 *   updatedAt: ISO string
 * }
 */

const express = require('express');
const router = express.Router();
const db = require('../lib/firebase');

const PATH = '/assignments';

/**
 * GET /api/assignments
 * Fetch all assignments
 * Query: ?status=active|expired|all (default: all active + expired)
 */
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const data = await db.get(PATH);
    
    if (!data) {
      return res.json({ success: true, count: 0, data: [] });
    }

    // Convert object to array
    let assignments = Object.entries(data).map(([id, item]) => ({ id, ...item }));
    
    // Filter by status
    if (status && status !== 'all') {
      assignments = assignments.filter(a => a.status === status);
    } else {
      // Default: exclude archived
      assignments = assignments.filter(a => a.status !== 'archived');
    }

    // Sort by deadline
    assignments.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    res.json({ success: true, count: assignments.length, data: assignments });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/assignments/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const data = await db.get(`${PATH}/${req.params.id}`);
    if (!data) {
      return res.status(404).json({ success: false, error: 'Not found' });
    }
    res.json({ success: true, data: { id: req.params.id, ...data } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/assignments
 * Create new assignment
 */
router.post('/', async (req, res) => {
  try {
    const { subject, title, teacher, details, dateGiven, deadline } = req.body;
    
    if (!subject || !title || !deadline) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required: subject, title, deadline' 
      });
    }

    const now = new Date().toISOString();
    const assignment = {
      subject,
      title,
      teacher: teacher || '',
      details: details || '',
      dateGiven: dateGiven || now,
      deadline,
      status: new Date(deadline) > new Date() ? 'active' : 'expired',
      createdAt: now,
      updatedAt: now
    };

    const result = await db.push(PATH, assignment);
    res.status(201).json({ 
      success: true, 
      data: { id: result.name, ...assignment } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/assignments/:id
 * Update assignment
 */
router.put('/:id', async (req, res) => {
  try {
    const existing = await db.get(`${PATH}/${req.params.id}`);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Not found' });
    }

    const updates = { ...req.body, updatedAt: new Date().toISOString() };
    delete updates.id;
    delete updates.createdAt;

    await db.update(`${PATH}/${req.params.id}`, updates);
    res.json({ success: true, data: { id: req.params.id, ...existing, ...updates } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/assignments/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    await db.remove(`${PATH}/${req.params.id}`);
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
