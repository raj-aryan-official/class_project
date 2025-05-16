import React, { useState } from 'react';

export default function TaskComments({ taskId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  React.useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [taskId]);

  const fetchComments = async () => {
    const res = await fetch(`/api/tasks/${taskId}/comments`);
    const data = await res.json();
    setComments(data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!text) return;
    await fetch(`/api/tasks/${taskId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    setText('');
    fetchComments();
  };

  return (
    <div style={{ marginTop: 8 }}>
      <b>Comments</b>
      <ul>
        {comments.map(c => (
          <li key={c._id}>{c.text} <small>({new Date(c.createdAt).toLocaleString()})</small></li>
        ))}
      </ul>
      <form onSubmit={handleAdd}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Add comment" />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
