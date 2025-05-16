import React, { useState, useEffect } from 'react';
import './NotificationList.css';

export default function NotificationList({ user }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) fetchNotifications();
    // eslint-disable-next-line
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications', {
        headers: { 'x-user-email': user.email }
      });
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      setNotifications([]);
    }
  };

  return (
    <div className="notification-list" style={{ marginTop: 20 }}>
      <h4>Notifications</h4>
      <ul>
        {notifications.map(n => (
          <li key={n._id}>{n.message} <small>({new Date(n.createdAt).toLocaleString()})</small></li>
        ))}
      </ul>
    </div>
  );
}
