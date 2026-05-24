import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.js';
import recordRoutes from './routes/records.js';

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'namazly_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // Cross-origin (Netlify + Render): must be 'none' + secure:true
      // so browser sends cookie across different domains.
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Namazly API is running' }));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
