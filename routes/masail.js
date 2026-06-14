import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Masla from '../models/Masla.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load masail.json into memory
let staticMasailList = [];
try {
  const jsonPath = path.join(__dirname, '../masail.json');
  if (fs.existsSync(jsonPath)) {
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    staticMasailList = JSON.parse(rawData);
    console.log(`Loaded ${staticMasailList.length} masail items from static JSON into memory.`);
  } else {
    console.warn("masail.json not found in server directory!");
  }
} catch (err) {
  console.error("Failed to load static masail.json:", err);
}

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

// GET /api/masail/views — get map of views for all viewed masail
router.get('/views', async (req, res) => {
  try {
    const viewedList = await Masla.find({}).select('slug views');
    const viewsMap = {};
    viewedList.forEach(v => {
      viewsMap[v.slug] = v.views;
    });
    return res.json({
      success: true,
      viewsMap
    });
  } catch (err) {
    console.error('Error fetching views map:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/masail/detail/:slug — return details and related masail for a slug, and increment view count
router.get('/detail/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // 1. Find the masla in our in-memory static list
    let masla = staticMasailList.find(m => m.slug === slug);
    
    // 2. If not found in static list, check MongoDB (in case it was added via admin panel)
    if (!masla) {
      masla = await Masla.findOne({ slug });
    }

    if (!masla) {
      return res.status(404).json({ success: false, message: 'Ruling not found.' });
    }

    // Convert mongoose document to plain object if fetched from DB
    const maslaObj = masla.toObject ? masla.toObject() : { ...masla };

    // 3. Record/Increment the views in MongoDB
    const dbMasla = await Masla.findOneAndUpdate(
      { slug },
      { 
        $inc: { views: 1 },
        $setOnInsert: {
          question: maslaObj.question,
          answer: maslaObj.answer,
          category: maslaObj.category || 'General',
          authority: maslaObj.authority || 'Darul Ifta',
          reference: maslaObj.reference || 'N/A'
        }
      },
      { 
        upsert: true, 
        new: true,
        runValidators: false,
        setDefaultsOnInsert: true 
      }
    );

    // Update views in the returned object
    maslaObj.views = dbMasla.views;

    // 4. Fetch up to 5 related masail in the same category
    const related = staticMasailList
      .filter(m => m.category === maslaObj.category && m.slug !== slug)
      .slice(0, 5);

    return res.json({
      success: true,
      masla: maslaObj,
      related,
      views: dbMasla.views
    });
  } catch (err) {
    console.error('Error fetching masla details:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
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
