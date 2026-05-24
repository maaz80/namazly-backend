import express from 'express';
import { getRecords, updateRecords, updateSingleRecord } from '../controllers/recordsController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, getRecords);
router.put('/', requireAuth, updateRecords);
router.patch('/single', requireAuth, updateSingleRecord);

export default router;
