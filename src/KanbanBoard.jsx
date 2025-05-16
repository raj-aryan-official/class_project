import React, { useState, useEffect, useRef } from 'react';
import TaskComments from './TaskComments';
import './KanbanBoard.css';

const defaultStatuses = ['To Do', 'In Progress', 'Done'];

export default function KanbanBoard({ project, user }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'To Do', assignee: '', dueDate: '' });

  const statuses = project?.statuses || defaultStatuses;

  useEffect(() => {
    if (project?._id) fetchTasks();
    // Real-time updates
    const socket = window.io && window.io();
    if (socket && project?._id) {
      socket.emit('joinProject', project._id);
      socket.on('taskUpdate', ({ type, task }) => {
        setTasks(prev => {
          if (type === 'create') return [...prev, task];
          if (type === 'update') return prev.map(t => t._id === task._id ? task : t);
          return prev;
        });
      });
    }
    return () => { if (socket) socket.disconnect(); };
    // eslint-disable-next-line
  }, [project?._id]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`/api/tasks/${project._id}`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      // handle error
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    try {
      const res = await fetch(`/api/tasks/${project._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          dueDate: newTask.dueDate,
          assigneeEmail: newTask.assignee
        })
      });
      const data = await res.json();
      setTasks([...tasks, data]);
      setNewTask({ title: '', description: '', status: 'To Do', assignee: '', dueDate: '' });
    } catch (err) {
      // handle error
    }
  };

  const moveTask = async (taskId, newStatus) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const updated = await res.json();
      setTasks(tasks.map(t => t._id === taskId ? updated : t));
    } catch (err) {
      // handle error
    }
  };

  return (
    <div className="kanban-board">
      {statuses.map(status => (
        <div key={status} className="kanban-column">
          <h3>{status}</h3>
          {tasks.filter(t => t.status === status).map(task => (
            <div key={task._id} className="kanban-task">
              <strong>{task.title}</strong>
              <p>{task.description}</p>
              <small>Assignee: {task.assignee || 'Unassigned'}</small>
              <small>Due Date: {task.dueDate || 'No due date'}</small>
              <div className="kanban-move-btns">
                {statuses.filter(s => s !== status).map(s => (
                  <button key={s} onClick={() => moveTask(task._id, s)}>{s}</button>
                ))}
                <TaskComments taskId={task._id} />
              </div>
            </div>
          ))}
          {status === 'To Do' && (
            <form onSubmit={handleAddTask} className="kanban-add-form">
              <input
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Task Title"
              />
              <input
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Description"
              />
              <input
                value={newTask.assignee}
                onChange={e => setNewTask({ ...newTask, assignee: e.target.value })}
                placeholder="Assignee"
              />
              <input
                value={newTask.dueDate}
                onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                placeholder="Due Date (YYYY-MM-DD)"
                type="date"
              />
              <button type="submit">Add</button>
            </form>
          )}
        </div>
      ))}
    </div>
  );
}
