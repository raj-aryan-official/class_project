const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'To Do' },
  createdAt: { type: Date, default: Date.now },
  comments: [{
    text: String,
    createdAt: { type: Date, default: Date.now },
  }],
});

module.exports = mongoose.model('Task', taskSchema);
