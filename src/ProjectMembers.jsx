import React, { useState, useEffect } from 'react';
import './ProjectMembers.css';

export default function ProjectMembers({ project, user }) {
  const [members, setMembers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteStatus, setInviteStatus] = useState('');

  useEffect(() => {
    if (project?._id) fetchMembers();
    // eslint-disable-next-line
  }, [project?._id]);

  const fetchMembers = async () => {
    try {
      const res = await fetch(`/api/projects/${project._id}/members`);
      const data = await res.json();
      setMembers(data);
    } catch (err) {
      setMembers([]);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteStatus('');
    if (!inviteEmail) return;
    try {
      const res = await fetch(`/api/projects/${project._id}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail })
      });
      if (res.ok) {
        setInviteStatus('Invitation sent!');
        setInviteEmail('');
        fetchMembers();
      } else {
        setInviteStatus('Failed to invite.');
      }
    } catch {
      setInviteStatus('Failed to invite.');
    }
  };

  return (
    <div className="project-members" style={{ marginTop: 20 }}>
      <h4>Project Members</h4>
      <ul>
        {members.map(m => (
          <li key={m._id}>{m.name} ({m.email})</li>
        ))}
      </ul>
      <form onSubmit={handleInvite} style={{ marginTop: 10 }}>
        <input
          value={inviteEmail}
          onChange={e => setInviteEmail(e.target.value)}
          placeholder="Invite by email"
        />
        <button type="submit">Invite</button>
      </form>
      {inviteStatus && <p>{inviteStatus}</p>}
    </div>
  );
}
