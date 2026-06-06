import express from 'express';
import jwt from 'jsonwebtoken';
import https from 'https';
import Review from '../models/Review.js';

const router = express.Router();

// Helper to optionally extract userId from Bearer token
const getOptionalUserId = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'namazly_secret');
      return decoded.userId;
    } catch (err) {
      // ignore invalid tokens and treat as guest
    }
  }
  return null;
};

// @route   GET /api/reviews
// @desc    Get all reviews sorted by newest
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ success: false, message: 'Server error fetching reviews' });
  }
});

// @route   POST /api/reviews
// @desc    Submit a review
router.post('/', async (req, res) => {
  const { rating, comment, guestName } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: 'Please provide a valid rating between 1 and 5' });
  }
  if (!comment || comment.trim() === '') {
    return res.status(400).json({ success: false, message: 'Please provide a review comment' });
  }

  try {
    const userId = getOptionalUserId(req);
    const reviewData = {
      rating,
      comment: comment.trim()
    };

    if (userId) {
      reviewData.user = userId;
    } else {
      reviewData.guestName = guestName && guestName.trim() !== '' ? guestName.trim() : 'Anonymous Guest';
    }

    const review = new Review(reviewData);
    await review.save();

    // Populate user if associated
    const populatedReview = await Review.findById(review._id).populate('user', 'name avatar');

    res.status(201).json({ success: true, review: populatedReview });
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ success: false, message: 'Server error creating review' });
  }
});

// @route   GET /api/reviews/proxy-avatar
// @desc    Proxy Google avatars with high-performance streaming and a 1-year cache lifespan
router.get('/proxy-avatar', (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send('URL is required');
  }

  // Ensure url is from googleusercontent to prevent SSRF vulnerabilities
  if (
    !url.startsWith('https://lh3.googleusercontent.com') &&
    !url.startsWith('https://googleusercontent.com') &&
    !url.startsWith('https://lh3.google.com')
  ) {
    return res.status(400).send('Invalid avatar URL host');
  }

  https.get(url, (response) => {
    if (response.statusCode !== 200) {
      return res.status(response.statusCode).send('Failed to fetch avatar');
    }

    res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // 1 year cache

    response.pipe(res);
  }).on('error', (err) => {
    console.error('Error proxying avatar:', err);
    res.status(500).send('Error proxying avatar');
  });
});

export default router;
