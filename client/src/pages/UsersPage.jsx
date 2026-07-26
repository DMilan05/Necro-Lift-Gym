import { useState, useEffect } from 'react';
import { api } from '../api/client';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [error, setError] = useState(null);

  const loadUsers = async () => {
    try {
      setUsers(await api.getUsers());
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createUser(form);
      setForm({ name: '', email: '' });
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-shell p-6 max-w-xl mx-auto">
      <h2 className="section-title text-3xl mb-6">Vendégek</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-8">
        <input
          className="input-brutal"
          placeholder="Név"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="input-brutal"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <button className="btn-brutal">Vendég felvétele</button>
      </form>

      {error && <p className="status-expired mb-4">{error}</p>}

      <ul className="flex flex-col gap-2">
        {users.map((u) => (
          <li key={u._id} className="card-brutal">
            {u.name} — {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersPage;