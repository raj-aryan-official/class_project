const express = require('express');
const router = express.Router();
const Automation = require('../models/Automation');
const Project = require('../models/Project');
const User = require('../models/User');

// Middleware to check project membership for automations
async function requireAutomationProjectMember(req, res, next) {
  const userEmail = req.headers['x-user-email'];
  if (!userEmail) return res.status(401).json({ error: 'User email required' });
  const user = await User.findOne({ email: userEmail });
  if (!user) return res.status(401).json({ error: 'User not found' });
  const project = await Project.findById(req.params.projectId);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  if (!project.members.map(id => id.toString()).includes(user._id.toString())) {
    return res.status(403).json({ error: 'Not a project member' });
  }
  req.user = user;
  req.project = project;
  next();
}

// Get all automations for a project
router.get('/:projectId', requireAutomationProjectMember, async (req, res) => {
  const automations = await Automation.find({ project: req.params.projectId });
  res.json(automations);
});

// Create a new automation
router.post('/:projectId', requireAutomationProjectMember, async (req, res) => {
  const { trigger, condition, action, createdByEmail } = req.body;
  const project = await Project.findById(req.params.projectId);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  const user = await User.findOne({ email: createdByEmail });
  if (!user) return res.status(400).json({ error: 'User not found' });
  const automation = new Automation({
    project: project._id,
    trigger,
    condition,
    action,
    createdBy: user._id,
  });
  await automation.save();
  res.json(automation);
});

module.exports = router;
