const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: String, // Google profile picture
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
