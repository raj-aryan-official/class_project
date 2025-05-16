const mongoose = require('mongoose');

const automationSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  trigger: { type: String, required: true }, // e.g., 'status_change', 'assignment', 'due_date_passed'
  condition: { type: Object }, // e.g., { status: 'Done' }, { assignee: userId }
  action: { type: Object }, // e.g., { type: 'assign_badge', badge: 'Finisher' }
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Automation', automationSchema);
