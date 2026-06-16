import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Review from '../models/Review.js';
import Visit from '../models/Visit.js';
import PageView from '../models/PageView.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

const getMongoWeek = (date) => {
  const janFirst = new Date(date.getFullYear(), 0, 1);
  const janFirstDay = janFirst.getDay();
  const firstSunday = new Date(janFirst);
  if (janFirstDay !== 0) {
    firstSunday.setDate(janFirst.getDate() + (7 - janFirstDay));
  }
  
  if (date < firstSunday) {
    return 0;
  }
  
  const diffTime = date.getTime() - firstSunday.getTime();
  const diffDays = Math.floor(diffTime / (24 * 60 * 60 * 1000));
  return Math.floor(diffDays / 7) + 1;
};

const fillMissingDates = (data, filter, now = new Date()) => {
  const result = [];
  const map = new Map(data.map(item => [item._id, item.count]));

  if (filter === 'month' || filter === '1year') {
    // Generate last 12 months
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const key = `${year}-${month}`;
      result.push({ _id: key, count: map.get(key) || 0 });
    }
  } else if (filter === '6month') {
    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const key = `${year}-${month}`;
      result.push({ _id: key, count: map.get(key) || 0 });
    }
  } else if (filter === 'week') {
    // Generate last 8 weeks
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const year = d.getFullYear();
      const weekNum = getMongoWeek(d);
      const key = `${year}-W${weekNum}`;
      result.push({ _id: key, count: map.get(key) || 0 });
    }
  } else {
    // Default: day (from the 1st of the current calendar month to the current date)
    const year = now.getFullYear();
    const monthIndex = now.getMonth();
    const currentDate = now.getDate();
    for (let d = 1; d <= currentDate; d++) {
      const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      result.push({ _id: dateStr, count: map.get(dateStr) || 0 });
    }
  }

  return result;
};

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
    const visitFilter = req.query.visitFilter || 'day'; // day, week, month, 6month, 1year
    const signupFilter = req.query.signupFilter || 'day'; // day, week, month, 6month, 1year
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Define date boundaries for visitor graph based on selected filter
    let visitStartDate;
    let groupFormat;

    if (visitFilter === 'week') {
      // Last 8 weeks
      visitStartDate = new Date(now.getTime() - 8 * 7 * 24 * 60 * 60 * 1000);
      groupFormat = 'week';
    } else if (visitFilter === 'month' || visitFilter === '1year') {
      // Last 12 months
      visitStartDate = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);
      groupFormat = '%Y-%m';
    } else if (visitFilter === '6month') {
      // Last 6 months
      visitStartDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      groupFormat = '%Y-%m';
    } else {
      // Start of the current calendar month
      visitStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
      groupFormat = '%Y-%m-%d';
    }

    // Build the aggregation group pipeline for visits
    let groupIdStage;
    if (visitFilter === 'week') {
      groupIdStage = {
        $concat: [
          { $dateToString: { format: '%Y', date: '$createdAt' } },
          '-W',
          { $toString: { $week: '$createdAt' } }
        ]
      };
    } else {
      groupIdStage = { $dateToString: { format: groupFormat, date: '$createdAt' } };
    }

    // Define date boundaries for signup graph based on selected filter
    let signupStartDate;
    let signupGroupFormat;

    if (signupFilter === 'week') {
      // Last 8 weeks
      signupStartDate = new Date(now.getTime() - 8 * 7 * 24 * 60 * 60 * 1000);
      signupGroupFormat = 'week';
    } else if (signupFilter === 'month' || signupFilter === '1year') {
      // Last 12 months
      signupStartDate = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);
      signupGroupFormat = '%Y-%m';
    } else if (signupFilter === '6month') {
      // Last 6 months
      signupStartDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      signupGroupFormat = '%Y-%m';
    } else {
      // Start of the current calendar month
      signupStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
      signupGroupFormat = '%Y-%m-%d';
    }

    // Build the aggregation group pipeline for signups
    let signupGroupIdStage;
    if (signupFilter === 'week') {
      signupGroupIdStage = {
        $concat: [
          { $dateToString: { format: '%Y', date: '$createdAt' } },
          '-W',
          { $toString: { $week: '$createdAt' } }
        ]
      };
    } else {
      signupGroupIdStage = { $dateToString: { format: signupGroupFormat, date: '$createdAt' } };
    }

    const [
      totalUsers,
      todayUsers,
      totalReviews,
      avgRatingResult,
      recentUsers,
      ratingDistribution,
      userGrowth,
      // NEW visitor metrics queries
      totalVisits,
      pwaInstalls,
      calculatedNamazCount,
      namazManagedCount,
      uniqueVisitors,
      visitorGrowth,
      recentVisitors,
      pageViews
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: startOfToday } }),
      Review.countDocuments(),
      Review.aggregate([{ $group: { _id: null, avg: { $avg: '$rating' } } }]),
      User.find().sort({ createdAt: -1 }).limit(10).select('name email avatar createdAt'),
      Review.aggregate([
        { $group: { _id: '$rating', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      // User signups grouped by signupFilter
      User.aggregate([
        { $match: { createdAt: { $gte: signupStartDate } } },
        {
          $group: {
            _id: signupGroupIdStage,
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      // 1. Total visits
      Visit.countDocuments(),
      // 2. PWA installs (unique devices count)
      Visit.distinct('visitorId', { isPwaInstall: true }).then(arr => arr.length),
      // 3. Calculated namaz count
      Visit.countDocuments({ calculatedNamaz: true }),
      // 3b. Managed namaz count
      Visit.countDocuments({ namazManaged: true }),
      // 4. Unique visitors (count distinct visitorIds)
      Visit.distinct('visitorId').then(arr => arr.length),
      // 5. Visitor growth grouped by day/week/month
      Visit.aggregate([
        { $match: { createdAt: { $gte: visitStartDate } } },
        {
          $group: {
            _id: groupIdStage,
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      // 6. Recent visitor logs
      Visit.find()
        .sort({ createdAt: -1 })
        .limit(20)
        .select('email ip userAgent calculatedNamaz namazManaged isPwaInstall createdAt visitorId'),
      // 7. Page-wise view statistics
      PageView.find()
        .sort({ views: -1 })
        .limit(100)
    ]);

    const avgRating = avgRatingResult.length > 0 ? Math.round(avgRatingResult[0].avg * 10) / 10 : 0;

    // Fill rating distribution (1-5)
    const ratingDist = [0, 0, 0, 0, 0];
    ratingDistribution.forEach(r => {
      if (r._id >= 1 && r._id <= 5) ratingDist[r._id - 1] = r.count;
    });

    // Zero-fill missing dates for visitor growth & user growth to display continuous timelines
    const filledVisitorGrowth = fillMissingDates(visitorGrowth, visitFilter, now);
    const filledUserGrowth = fillMissingDates(userGrowth, signupFilter, now);

    // Calculate average visits per period in the graph
    const totalGroupedVisits = filledVisitorGrowth.reduce((sum, item) => sum + item.count, 0);
    const avgVisits = filledVisitorGrowth.length > 0 ? Math.round((totalGroupedVisits / filledVisitorGrowth.length) * 10) / 10 : 0;

    return res.json({
      success: true,
      stats: {
        totalUsers,
        todayUsers,
        totalReviews,
        avgRating,
        recentUsers,
        ratingDistribution: ratingDist,
        userGrowth: filledUserGrowth,
        totalVisits,
        pwaInstalls,
        calculatedNamazCount,
        namazManagedCount,
        uniqueVisitors,
        visitorGrowth: filledVisitorGrowth,
        avgVisits,
        recentVisitors,
        pageViews
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

// GET /api/admin/visitors — list all visitors or unique visitors with pagination
router.get('/visitors', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const type = req.query.type || 'all'; // all or unique

    if (type === 'unique') {
      const [visitors, totalResult] = await Promise.all([
        Visit.aggregate([
          { $sort: { createdAt: -1 } },
          {
            $group: {
              _id: '$visitorId',
              latestVisit: { $first: '$$ROOT' }
            }
          },
          { $sort: { 'latestVisit.createdAt': -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $project: {
              _id: '$latestVisit._id',
              visitorId: '$_id',
              email: '$latestVisit.email',
              ip: '$latestVisit.ip',
              userAgent: '$latestVisit.userAgent',
              calculatedNamaz: '$latestVisit.calculatedNamaz',
              namazManaged: '$latestVisit.namazManaged',
              isPwaInstall: '$latestVisit.isPwaInstall',
              createdAt: '$latestVisit.createdAt'
            }
          }
        ]),
        Visit.aggregate([
          { $group: { _id: '$visitorId' } },
          { $count: 'count' }
        ])
      ]);

      const total = totalResult.length > 0 ? totalResult[0].count : 0;
      return res.json({
        success: true,
        visitors,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      });
    } else {
      // type === 'all'
      const [visitors, total] = await Promise.all([
        Visit.find()
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .select('email ip userAgent calculatedNamaz namazManaged isPwaInstall createdAt visitorId'),
        Visit.countDocuments()
      ]);

      return res.json({
        success: true,
        visitors,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      });
    }
  } catch (err) {
    console.error('Admin visitors error:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching visitors' });
  }
});

export default router;
