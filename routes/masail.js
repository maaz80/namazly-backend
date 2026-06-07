import express from 'express';
import Masla from '../models/Masla.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// Helper to generate a slug from a question
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // remove non-word chars
    .replace(/[\s_]+/g, '-')  // replace spaces/underscores with -
    .replace(/^-+|-+$/g, ''); // trim leading/trailing dashes
};

// GET /api/masail — list all masail with optional category, search, and pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const { category, search } = req.query;

    const filter = {};
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { question: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } }
      ];
    }

    const [masail, total] = await Promise.all([
      Masla.find(filter)
        .sort({ views: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Masla.countDocuments(filter)
    ]);

    // Fetch unique categories for listing filters
    const categories = await Masla.distinct('category');

    return res.json({
      success: true,
      masail,
      categories: ['All', ...categories],
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('Error fetching masail:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching masail' });
  }
});

// GET /api/masail/detail/:slug — retrieve single masla by slug and get related masail
router.get('/detail/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Find the current masla
    const masla = await Masla.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!masla) {
      return res.status(404).json({ success: false, message: 'Masla not found' });
    }

    // Get related questions (same category, excluding current)
    const related = await Masla.find({
      category: masla.category,
      _id: { $ne: masla._id }
    })
      .limit(5)
      .select('question slug category');

    return res.json({
      success: true,
      masla,
      related
    });
  } catch (err) {
    console.error('Error fetching masla details:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching masla details' });
  }
});

// POST /api/masail — create a new masla (Admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { question, answer, authority, reference, category } = req.body;

    if (!question || !answer || !category) {
      return res.status(400).json({ success: false, message: 'Question, answer, and category are required' });
    }

    let slug = slugify(question);
    
    // Ensure slug is unique
    const existing = await Masla.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const newMasla = new Masla({
      slug,
      question,
      answer,
      authority,
      reference,
      category
    });

    await newMasla.save();
    return res.json({ success: true, masla: newMasla });
  } catch (err) {
    console.error('Error creating masla:', err);
    return res.status(500).json({ success: false, message: 'Server error creating masla' });
  }
});

// DELETE /api/masail/:id — delete a masla (Admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const masla = await Masla.findByIdAndDelete(req.params.id);
    if (!masla) {
      return res.status(404).json({ success: false, message: 'Masla not found' });
    }
    return res.json({ success: true, message: 'Masla deleted successfully' });
  } catch (err) {
    console.error('Error deleting masla:', err);
    return res.status(500).json({ success: false, message: 'Server error deleting masla' });
  }
});


export default router;
