import express from 'express';
import { getUserById, updateUser } from '../models/queries.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
});

// Update user profile
router.put('/profile', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { bio, avatar } = req.body;

    const user = await updateUser(userId, { bio, avatar });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
});

export default router;
