const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Search users
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.json([]);
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ],
      _id: { $ne: req.userId }
    }).limit(10);

    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { username, email } = req.body;

    // Check if username or email is already taken by another user
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
      _id: { $ne: req.userId }
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'Username or email already taken' 
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { username, email },
      { new: true }
    );

    res.json({ 
      message: 'Profile updated successfully',
      user: user.toJSON() 
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
