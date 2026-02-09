import express from 'express';
import {
  createReply,
  getReplies,
  getReplyCount,
  deletePost,
} from '../models/queries.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Create reply
router.post('/:postId/reply', isAuthenticated, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, image } = req.body;
    const userId = req.session.userId;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Content is required' });
    }

    if (content.length > 280) {
      return res.status(400).json({ success: false, error: 'Content exceeds 280 characters' });
    }

    const reply = await createReply(userId, postId, content, image || null);

    res.status(201).json({
      success: true,
      data: {
        ...reply,
        like_count: 0,
        retweet_count: 0,
        reply_count: 0,
        liked: false,
        retweeted: false,
      },
    });
  } catch (err) {
    console.error('Create reply error:', err);
    res.status(500).json({ success: false, error: 'Failed to create reply' });
  }
});

// Get replies for a post
router.get('/:postId/replies', async (req, res) => {
  try {
    const { postId } = req.params;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = parseInt(req.query.offset) || 0;
    const userId = req.session?.userId || null;

    const replies = await getReplies(postId, limit, offset, userId);

    res.json({
      success: true,
      data: replies,
    });
  } catch (err) {
    console.error('Get replies error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch replies' });
  }
});

// Get reply count for a post
router.get('/:postId/reply-count', async (req, res) => {
  try {
    const { postId } = req.params;
    const count = await getReplyCount(postId);

    res.json({
      success: true,
      data: { count },
    });
  } catch (err) {
    console.error('Get reply count error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch reply count' });
  }
});

// Delete reply
router.delete('/:replyId', isAuthenticated, async (req, res) => {
  try {
    const { replyId } = req.params;
    const userId = req.session.userId;

    const result = await deletePost(replyId, userId);

    if (!result) {
      return res.status(404).json({ success: false, error: 'Reply not found or not owned by user' });
    }

    res.json({
      success: true,
      message: 'Reply deleted',
    });
  } catch (err) {
    console.error('Delete reply error:', err);
    res.status(500).json({ success: false, error: 'Failed to delete reply' });
  }
});

export default router;
