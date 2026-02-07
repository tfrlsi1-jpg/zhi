import express from 'express';
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  isFollowing,
} from '../models/queries.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Follow user
router.post('/:userId', isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.params;
    const followerId = req.session.userId;

    if (userId === followerId) {
      return res.status(400).json({ success: false, error: 'Cannot follow yourself' });
    }

    const result = await followUser(followerId, userId);

    if (!result) {
      return res.status(409).json({ success: false, error: 'Already following this user' });
    }

    res.status(201).json({
      success: true,
      message: 'User followed',
    });
  } catch (err) {
    console.error('Follow error:', err);
    res.status(500).json({ success: false, error: 'Failed to follow user' });
  }
});

// Unfollow user
router.delete('/:userId', isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.params;
    const followerId = req.session.userId;

    const result = await unfollowUser(followerId, userId);

    if (!result) {
      return res.status(404).json({ success: false, error: 'Not following this user' });
    }

    res.json({
      success: true,
      message: 'User unfollowed',
    });
  } catch (err) {
    console.error('Unfollow error:', err);
    res.status(500).json({ success: false, error: 'Failed to unfollow user' });
  }
});

// Get followers
router.get('/:userId/followers', async (req, res) => {
  try {
    const { userId } = req.params;
    const followers = await getFollowers(userId);

    res.json({
      success: true,
      data: followers,
    });
  } catch (err) {
    console.error('Get followers error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch followers' });
  }
});

// Get following
router.get('/:userId/following', async (req, res) => {
  try {
    const { userId } = req.params;
    const following = await getFollowing(userId);

    res.json({
      success: true,
      data: following,
    });
  } catch (err) {
    console.error('Get following error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch following' });
  }
});

// Check if following
router.get('/:userId/is-following', isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.session.userId;

    const result = await isFollowing(currentUserId, userId);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error('Check following error:', err);
    res.status(500).json({ success: false, error: 'Failed to check follow status' });
  }
});

export default router;
