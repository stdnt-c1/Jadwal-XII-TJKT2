/**
 * Assignment Cron Jobs - Simplified
 * 
 * 1. Mark assignments as 'expired' when deadline passes
 * 2. Delete expired assignments after 1 week
 */

const cron = require('node-cron');
const db = require('../lib/firebase');

const PATH = '/assignments';

/**
 * Mark expired assignments and delete old ones
 */
async function runMaintenance() {
  if (!db.isConfigured()) {
    console.log('[CRON] Database not configured, skipping');
    return { expired: 0, deleted: 0 };
  }

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  console.log(`[CRON] Running maintenance at ${now.toISOString()}`);

  try {
    const data = await db.get(PATH);
    if (!data) {
      console.log('[CRON] No assignments found');
      return { expired: 0, deleted: 0 };
    }

    let expiredCount = 0;
    let deletedCount = 0;
    const updates = {};

    for (const [id, assignment] of Object.entries(data)) {
      const deadline = new Date(assignment.deadline);
      const expiredAt = assignment.expiredAt ? new Date(assignment.expiredAt) : null;

      // Mark active assignments as expired if past deadline
      if (assignment.status === 'active' && deadline <= now) {
        updates[`${id}/status`] = 'expired';
        updates[`${id}/expiredAt`] = now.toISOString();
        updates[`${id}/updatedAt`] = now.toISOString();
        expiredCount++;
        console.log(`[CRON] Marking "${assignment.title}" as expired`);
      }

      // Delete expired assignments older than 1 week
      if (assignment.status === 'expired' && expiredAt && expiredAt <= oneWeekAgo) {
        updates[id] = null; // Setting to null deletes in Firebase
        deletedCount++;
        console.log(`[CRON] Deleting "${assignment.title}"`);
      }
    }

    // Apply all updates in one request
    if (Object.keys(updates).length > 0) {
      await db.update(PATH, updates);
    }

    console.log(`[CRON] Done: ${expiredCount} expired, ${deletedCount} deleted`);
    return { expired: expiredCount, deleted: deletedCount };
  } catch (error) {
    console.error('[CRON] Error:', error.message);
    return { error: error.message };
  }
}

/**
 * Initialize cron jobs
 */
function initCronJobs() {
  if (!db.isConfigured()) {
    console.log('[CRON] Database not configured, cron jobs disabled');
    return;
  }

  console.log('[CRON] Starting cron jobs...');

  // Run every hour at :00
  cron.schedule('0 * * * *', runMaintenance, {
    timezone: 'Asia/Makassar'
  });

  console.log('[CRON] Scheduled: Hourly maintenance (WITA)');

  // Initial run after 3 seconds
  setTimeout(runMaintenance, 3000);
}

module.exports = { initCronJobs, runMaintenance };
