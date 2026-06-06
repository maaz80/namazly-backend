import express from 'express';
import Visit from '../models/Visit.js';
import User from '../models/User.js';

const router = express.Router();

// Helper to extract clean IP address
const getClientIp = (req) => {
  let ip = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress || 'Unknown';
  if (ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }
  if (ip === '::1' || ip === '::ffff:127.0.0.1' || ip === '127.0.0.1') {
    return '127.0.0.1 (Localhost)';
  }
  return ip;
};

// POST /api/analytics/visit - Record a new session visit or update existing
router.post('/visit', async (req, res) => {
  try {
    const { sessionToken, visitorId, email, isPwaInstall } = req.body;

    if (!sessionToken || !visitorId) {
      return res.status(400).json({ success: false, message: 'Session token and visitor ID are required' });
    }

    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'] || '';

    // Check if user is logged in (match by email to find user ID if not provided, or search by email)
    let userId = null;
    if (email) {
      const matchedUser = await User.findOne({ email }).select('_id');
      if (matchedUser) {
        userId = matchedUser._id;
      }
    }

    // Try to find if session already exists
    let visit = await Visit.findOne({ sessionToken });

    if (visit) {
      // If it exists, update user info if it was missing
      let changed = false;
      if (email && visit.email !== email) {
        visit.email = email;
        changed = true;
      }
      if (userId && !visit.user) {
        visit.user = userId;
        changed = true;
      }
      if (isPwaInstall && !visit.isPwaInstall) {
        visit.isPwaInstall = true;
        changed = true;
      }
      if (changed) {
        await visit.save();
      }
    } else {
      // Create new visit
      visit = new Visit({
        sessionToken,
        visitorId,
        user: userId || undefined,
        email: email || undefined,
        ip,
        userAgent,
        isPwaInstall: !!isPwaInstall
      });
      await visit.save();
    }

    return res.status(200).json({ success: true, visit });
  } catch (error) {
    console.error('Error recording visit:', error);
    return res.status(500).json({ success: false, message: 'Server error recording visit' });
  }
});

// POST /api/analytics/calculate - Mark that a user calculated namaz in this session
router.post('/calculate', async (req, res) => {
  try {
    const { sessionToken } = req.body;
    if (!sessionToken) {
      return res.status(400).json({ success: false, message: 'Session token is required' });
    }

    const visit = await Visit.findOneAndUpdate(
      { sessionToken },
      { $set: { calculatedNamaz: true } },
      { new: true }
    );

    return res.status(200).json({ success: true, visit });
  } catch (error) {
    console.error('Error updating calculation event:', error);
    return res.status(500).json({ success: false, message: 'Server error updating calculation' });
  }
});

// POST /api/analytics/pwa-install - Mark PWA install in this session
router.post('/pwa-install', async (req, res) => {
  try {
    const { sessionToken } = req.body;
    if (!sessionToken) {
      return res.status(400).json({ success: false, message: 'Session token is required' });
    }

    const visit = await Visit.findOneAndUpdate(
      { sessionToken },
      { $set: { isPwaInstall: true } },
      { new: true }
    );

    return res.status(200).json({ success: true, visit });
  } catch (error) {
    console.error('Error updating PWA install event:', error);
    return res.status(500).json({ success: false, message: 'Server error updating PWA install' });
  }
});

// POST /api/analytics/manage - Mark that a user managed/adjusted namaz in this session
router.post('/manage', async (req, res) => {
  try {
    const { sessionToken } = req.body;
    if (!sessionToken) {
      return res.status(400).json({ success: false, message: 'Session token is required' });
    }

    const visit = await Visit.findOneAndUpdate(
      { sessionToken },
      { $set: { namazManaged: true } },
      { new: true }
    );

    return res.status(200).json({ success: true, visit });
  } catch (error) {
    console.error('Error updating management event:', error);
    return res.status(500).json({ success: false, message: 'Server error updating management status' });
  }
});

export default router;
