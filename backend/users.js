const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Upsert user on login (Google OAuth)
router.post('/login', async (req, res) => {
  const { name, email, avatar } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ name, email, avatar });
    await user.save();
  } else {
    user.name = name;
    user.avatar = avatar;
    await user.save();
  }
  res.json(user);
});

module.exports = router;
