import express from 'express';
import { retweetPost, unretweetPost } from '../models/queries.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Retweet post
router.post('/:postId', isAuthenticated, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.session.userId;

    const result = await retweetPost(userId, postId);

    if (!result) {
      return res.status(409).json({ success: false, error: 'Already retweeted this post' });
    }

    res.status(201).json({
      success: true,
      message: 'Post retweeted',
    });
  } catch (err) {
    console.error('Retweet error:', err);
    res.status(500).json({ success: false, error: 'Failed to retweet' });
  }
});

// Remove retweet
router.delete('/:postId', isAuthenticated, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.session.userId;

    const result = await unretweetPost(userId, postId);

    if (!result) {
      return res.status(404).json({ success: false, error: 'Not retweeted' });
    }

    res.json({
      success: true,
      message: 'Retweet removed',
    });
  } catch (err) {
    console.error('Remove retweet error:', err);
    res.status(500).json({ success: false, error: 'Failed to remove retweet' });
  }
});

export default router;
