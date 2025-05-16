const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const Automation = require('./models/Automation');
const Notification = require('./models/Notification');
const { io } = require('./index');

// Middleware to check project membership for tasks
async function requireTaskProjectMember(req, res, next) {
  const userEmail = req.headers['x-user-email'];
  if (!userEmail) return res.status(401).json({ error: 'User email required' });
  const user = await User.findOne({ email: userEmail });
  if (!user) return res.status(401).json({ error: 'User not found' });
  let projectId;
  if (req.params.projectId) projectId = req.params.projectId;
  else {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    projectId = task.project;
  }
  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  if (!project.members.map(id => id.toString()).includes(user._id.toString())) {
    return res.status(403).json({ error: 'Not a project member' });
  }
  req.user = user;
  req.project = project;
  next();
}

// Automation engine: check and trigger automations on task update
async function runAutomationsOnTaskUpdate(task, prevTask) {
  const automations = await Automation.find({ project: task.project });
  for (const auto of automations) {
    // Trigger: status_change
    if (auto.trigger === 'status_change' && prevTask.status !== task.status) {
      if (auto.condition.status === task.status) {
        if (auto.action.type === 'assign_badge') {
          // Example: assign badge (store as notification for now)
          await Notification.create({
            user: task.assignee,
            message: `Badge assigned: ${auto.action.badge}`
          });
        }
        if (auto.action.type === 'move_task') {
          task.status = auto.action.toStatus;
          await task.save();
        }
      }
    }
    // Trigger: assignment
    if (auto.trigger === 'assignment' && prevTask.assignee !== task.assignee) {
      if (auto.condition.assignee === String(task.assignee)) {
        if (auto.action.type === 'move_task') {
          task.status = auto.action.toStatus;
          await task.save();
        }
      }
    }
    // Trigger: due_date_passed (should be run by a scheduled job, not here)
  }
}

// Get all tasks for a project
router.get('/:projectId', requireTaskProjectMember, async (req, res) => {
  const tasks = await Task.find({ project: req.params.projectId });
  res.json(tasks);
});

// Create a new task
router.post('/:projectId', requireTaskProjectMember, async (req, res) => {
  const { title, description, dueDate, assigneeEmail } = req.body;
  const project = await Project.findById(req.params.projectId);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  let assignee = null;
  if (assigneeEmail) {
    assignee = await User.findOne({ email: assigneeEmail });
    if (!assignee) {
      assignee = new User({ email: assigneeEmail, name: assigneeEmail });
      await assignee.save();
    }
  }
  const task = new Task({
    project: project._id,
    title,
    description,
    dueDate,
    assignee: assignee?._id,
    status: 'To Do',
  });
  await task.save();
  io.to(project._id.toString()).emit('taskUpdate', { type: 'create', task });
  res.json(task);
});

// Update task status or assignment
router.patch('/:taskId', requireTaskProjectMember, async (req, res) => {
  const { status, assigneeEmail } = req.body;
  const update = {};
  if (status) update.status = status;
  if (assigneeEmail) {
    let assignee = await User.findOne({ email: assigneeEmail });
    if (!assignee) {
      assignee = new User({ email: assigneeEmail, name: assigneeEmail });
      await assignee.save();
    }
    update.assignee = assignee._id;
  }
  const prevTask = await Task.findById(req.params.taskId);
  const task = await Task.findByIdAndUpdate(req.params.taskId, update, { new: true });
  await runAutomationsOnTaskUpdate(task, prevTask);
  io.to(task.project.toString()).emit('taskUpdate', { type: 'update', task });
  res.json(task);
});

// Task comments API
router.get('/:taskId/comments', requireTaskProjectMember, async (req, res) => {
  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json([]);
  res.json(task.comments || []);
});

router.post('/:taskId/comments', requireTaskProjectMember, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text required' });
  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  task.comments.push({ text });
  await task.save();
  res.json({ success: true });
});

module.exports = router;
