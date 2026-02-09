import express from 'express';
import {
  createPost,
  getFeed,
  getUserPosts,
  deletePost,
  getPostById,
  createReply,
  getReplies,
  getReplyCount,
} from '../models/queries.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Create post
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { content, image } = req.body;
    const userId = req.session.userId;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Content is required' });
    }

    if (content.length > 280) {
      return res.status(400).json({ success: false, error: 'Content exceeds 280 characters' });
    }

    const post = await createPost(userId, content, image || null);

    res.status(201).json({
      success: true,
      data: {
        ...post,
        like_count: 0,
        retweet_count: 0,
        reply_count: 0,
        liked: false,
        retweeted: false,
      },
    });
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ success: false, error: 'Failed to create post' });
  }
});

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

// Get feed
router.get('/feed', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = parseInt(req.query.offset) || 0;
    const userId = req.session?.userId || null;

    const posts = await getFeed(limit, offset, userId);

    res.json({
      success: true,
      data: posts,
    });
  } catch (err) {
    console.error('Get feed error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch feed' });
  }
});

// Get user's posts
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = parseInt(req.query.offset) || 0;
    const currentUserId = req.session?.userId || null;

    const posts = await getUserPosts(userId, limit, offset, currentUserId);

    res.json({
      success: true,
      data: posts,
    });
  } catch (err) {
    console.error('Get user posts error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch user posts' });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await getPostById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    res.json({
      success: true,
      data: post,
    });
  } catch (err) {
    console.error('Get post error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch post' });
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

// Delete post
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;

    const result = await deletePost(id, userId);

    if (!result) {
      return res.status(404).json({ success: false, error: 'Post not found or not owned by user' });
    }

    res.json({
      success: true,
      message: 'Post deleted',
    });
  } catch (err) {
    console.error('Delete post error:', err);
    res.status(500).json({ success: false, error: 'Failed to delete post' });
  }
});

export default router;
