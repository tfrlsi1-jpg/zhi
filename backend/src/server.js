import express from 'express';
import cors from 'cors';
import session from 'express-session';
// body-parser not needed; Express has built-in parsers
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import postsRoutes from './routes/posts.js';
import likesRoutes from './routes/likes.js';
import retweetsRoutes from './routes/retweets.js';
import followsRoutes from './routes/follows.js';
import usersRoutes from './routes/users.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
app.set('trust proxy', 1);

const isProd = process.env.NODE_ENV === 'production';

if (isProd && !process.env.FRONTEND_URL) {
  console.error('Missing FRONTEND_URL in production — CORS will block cross-origin requests if not configured.');
}

if (isProd && !process.env.SESSION_SECRET) {
  console.error('Missing SESSION_SECRET in production — using insecure default session secret.');
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProd,
    // 跨網域存取必須改為 'none'，否則 Cookie 傳不過去
    sameSite: isProd ? 'none' : 'lax',    
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/likes', likesRoutes);
app.use('/api/retweets', retweetsRoutes);
app.use('/api/follows', followsRoutes);
app.use('/api/users', usersRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server is running on port ${PORT}`);
});

//app.listen(PORT, () => {
//  console.log(`🟠 Zhi server running on port ${PORT}`);
//  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
//});
