import React, { useState, useEffect } from 'react';
import './AutomationList.css';

export default function AutomationList({ project, user }) {
  const [automations, setAutomations] = useState([]);
  const [form, setForm] = useState({ trigger: '', condition: '', action: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (project?._id) fetchAutomations();
    // eslint-disable-next-line
  }, [project?._id]);

  const fetchAutomations = async () => {
    try {
      const res = await fetch(`/api/automations/${project._id}`);
      const data = await res.json();
      setAutomations(data);
    } catch (err) {
      setError('Failed to load automations');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.trigger || !form.condition || !form.action) return setError('All fields required');
    try {
      const res = await fetch(`/api/automations/${project._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trigger: form.trigger,
          condition: JSON.parse(form.condition),
          action: JSON.parse(form.action),
          createdByEmail: user.email
        })
      });
      const data = await res.json();
      setAutomations([...automations, data]);
      setForm({ trigger: '', condition: '', action: '' });
      setError(null);
    } catch (err) {
      setError('Failed to create automation. Use valid JSON for condition/action.');
    }
  };

  return (
    <div className="automation-list" style={{ marginTop: 30 }}>
      <h3>Automations</h3>
      <ul>
        {automations.map(a => (
          <li key={a._id}>
            <b>{a.trigger}</b> | Condition: {JSON.stringify(a.condition)} | Action: {JSON.stringify(a.action)}
          </li>
        ))}
      </ul>
      <form onSubmit={handleCreate} style={{ marginTop: 10 }}>
        <input
          value={form.trigger}
          onChange={e => setForm({ ...form, trigger: e.target.value })}
          placeholder="Trigger (e.g. status_change)"
        />
        <input
          value={form.condition}
          onChange={e => setForm({ ...form, condition: e.target.value })}
          placeholder='Condition (JSON: {"status":"Done"})'
        />
        <input
          value={form.action}
          onChange={e => setForm({ ...form, action: e.target.value })}
          placeholder='Action (JSON: {"type":"assign_badge","badge":"Finisher"})'
        />
        <button type="submit">Add Automation</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
