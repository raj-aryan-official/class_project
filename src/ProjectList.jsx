import React, { useState, useEffect } from 'react';
import './ProjectList.css';

export default function ProjectList({ user, onSelectProject }) {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`/api/projects?email=${encodeURIComponent(user.email)}`);
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title) return setError('Title required');
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, ownerEmail: user.email })
      });
      const data = await res.json();
      setProjects([...projects, data]);
      setTitle('');
      setDescription('');
      setError(null);
    } catch (err) {
      setError('Failed to create project');
    }
  };

  if (!user) return <p>Please login to view projects.</p>;

  return (
    <div className="project-list">
      <h2>Your Projects</h2>
      <ul>
        {projects.map((p) => (
          <li key={p._id}>
            <button onClick={() => onSelectProject(p)}>{p.title}</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleCreate}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Project Title"
        />
        <input
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
        />
        <button type="submit">Create Project</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
