// Entry point for TaskBoard Pro backend
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const { app, server, io } = require('./socket');
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Projects API router
const projectsRouter = require('./projects');
app.use('/api/projects', projectsRouter);

// Tasks API router
const tasksRouter = require('./tasks');
app.use('/api/tasks', tasksRouter);

// Automations API router
const automationsRouter = require('./automations');
app.use('/api/automations', automationsRouter);

// Users API router
const usersRouter = require('./users');
app.use('/api/users', usersRouter);

// Notifications API router
const notificationsRouter = require('./notifications');
app.use('/api/notifications', notificationsRouter);

// Placeholder route
app.get('/', (req, res) => {
  res.send('TaskBoard Pro API running');
});

// WebSocket events for real-time task updates
io.on('connection', (socket) => {
  socket.on('joinProject', (projectId) => {
    socket.join(projectId);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export io for use in other modules
module.exports.io = io;
