import express from 'express';
import { likePost, unlikePost } from '../models/queries.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Like post
router.post('/:postId', isAuthenticated, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.session.userId;

    const result = await likePost(userId, postId);

    if (!result) {
      return res.status(409).json({ success: false, error: 'Already liked this post' });
    }

    res.status(201).json({
      success: true,
      message: 'Post liked',
    });
  } catch (err) {
    console.error('Like post error:', err);
    res.status(500).json({ success: false, error: 'Failed to like post' });
  }
});

// Unlike post
router.delete('/:postId', isAuthenticated, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.session.userId;

    const result = await unlikePost(userId, postId);

    if (!result) {
      return res.status(404).json({ success: false, error: 'Not liked' });
    }

    res.json({
      success: true,
      message: 'Post unliked',
    });
  } catch (err) {
    console.error('Unlike post error:', err);
    res.status(500).json({ success: false, error: 'Failed to unlike post' });
  }
});

export default router;
