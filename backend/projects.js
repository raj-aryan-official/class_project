const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User');

// Middleware to check project membership
async function requireProjectMember(req, res, next) {
  const userEmail = req.headers['x-user-email'];
  if (!userEmail) return res.status(401).json({ error: 'User email required' });
  const user = await User.findOne({ email: userEmail });
  if (!user) return res.status(401).json({ error: 'User not found' });
  const projectId = req.params.projectId || req.params.id;
  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  if (!project.members.map(id => id.toString()).includes(user._id.toString())) {
    return res.status(403).json({ error: 'Not a project member' });
  }
  req.user = user;
  req.project = project;
  next();
}

// Get all projects for a user
router.get('/', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email required' });
  const user = await User.findOne({ email });
  if (!user) return res.json([]);
  const projects = await Project.find({ members: user._id });
  res.json(projects);
});

// Create a new project
router.post('/', async (req, res) => {
  const { title, description, ownerEmail } = req.body;
  const owner = await User.findOne({ email: ownerEmail });
  if (!owner) return res.status(400).json({ error: 'Owner not found' });
  const project = new Project({
    title,
    description,
    owner: owner._id,
    members: [owner._id],
  });
  await project.save();
  res.json(project);
});

// Invite user to project by email
router.post('/:id/invite', requireProjectMember, async (req, res) => {
  const { email } = req.body;
  const project = req.project;
  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ email, name: email });
    await user.save();
  }
  if (!project.members.includes(user._id)) {
    project.members.push(user._id);
    await project.save();
  }
  res.json({ success: true });
});

// Get project members
router.get('/:id/members', requireProjectMember, async (req, res) => {
  res.json(req.project.members);
});

module.exports = router;
