const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const User = require('../models/User');

// Get notifications for a user
router.get('/', async (req, res) => {
  const userEmail = req.headers['x-user-email'];
  if (!userEmail) return res.status(401).json([]);
  const user = await User.findOne({ email: userEmail });
  if (!user) return res.status(401).json([]);
  const notifications = await Notification.find({ user: user._id }).sort({ createdAt: -1 });
  res.json(notifications);
});

module.exports = router;
