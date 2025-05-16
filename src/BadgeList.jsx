import React from 'react';
import './BadgeList.css';

export default function BadgeList({ notifications }) {
  // Filter badge notifications
  const badges = notifications.filter(n => n.message.startsWith('Badge assigned: '));
  return (
    <div className="badge-list" style={{ marginTop: 20 }}>
      <h4>User Badges</h4>
      <ul>
        {badges.map(b => (
          <li key={b._id}>{b.message.replace('Badge assigned: ', '')}</li>
        ))}
      </ul>
    </div>
  );
}
