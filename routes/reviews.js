import express from 'express';
import jwt from 'jsonwebtoken';
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

export default router;
