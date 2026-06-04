import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Review from '../models/Review.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }

  const token = jwt.sign(
    { email, isAdmin: true },
    process.env.JWT_SECRET || 'namazly_secret',
    { expiresIn: '24h' }
  );

  return res.json({ success: true, token });
});

// GET /api/admin/stats — aggregate dashboard statistics
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [totalUsers, todayUsers, totalReviews, avgRatingResult, recentUsers, ratingDistribution, userGrowth] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: startOfToday } }),
      Review.countDocuments(),
      Review.aggregate([{ $group: { _id: null, avg: { $avg: '$rating' } } }]),
      User.find().sort({ createdAt: -1 }).limit(10).select('name email avatar createdAt'),
      Review.aggregate([
        { $group: { _id: '$rating', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      // User signups per day for the last 30 days
      User.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    const avgRating = avgRatingResult.length > 0 ? Math.round(avgRatingResult[0].avg * 10) / 10 : 0;

    // Fill rating distribution (1-5)
    const ratingDist = [0, 0, 0, 0, 0];
    ratingDistribution.forEach(r => {
      if (r._id >= 1 && r._id <= 5) ratingDist[r._id - 1] = r.count;
    });

    return res.json({
      success: true,
      stats: {
        totalUsers,
        todayUsers,
        totalReviews,
        avgRating,
        recentUsers,
        ratingDistribution: ratingDist,
        userGrowth
      }
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching stats' });
  }
});

// GET /api/admin/users — list all users with pagination
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';

    const filter = search
      ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
      : {};

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('name email avatar qazaRecord createdAt'),
      User.countDocuments(filter)
    ]);

    return res.json({ success: true, users, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('Admin users error:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching users' });
  }
});

// GET /api/admin/reviews — list all reviews
router.get('/reviews', requireAdmin, async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 });
    return res.json({ success: true, reviews });
  } catch (err) {
    console.error('Admin reviews error:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching reviews' });
  }
});

// DELETE /api/admin/reviews/:id — delete a specific review
router.delete('/reviews/:id', requireAdmin, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    return res.json({ success: true, message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Admin delete review error:', err);
    return res.status(500).json({ success: false, message: 'Server error deleting review' });
  }
});

export default router;
