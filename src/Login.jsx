import React, { useState } from 'react';
import { signInWithGoogle, logout } from './firebase';
import './Login.css';

export default function Login({ onLogin, user }) {
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const userData = await signInWithGoogle();
      onLogin(userData);
    } catch (err) {
      setError('Login failed.');
    }
  };

  const handleLogout = async () => {
    await logout();
    onLogin(null);
  };

  if (user) {
    return (
      <div className="login-user">
        <img src={user.avatar} alt="avatar" className="login-avatar" />
        <span>{user.name}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <button className="login-google-btn" onClick={handleLogin}>
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: 22, height: 22 }} />
        Sign in with Google
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
