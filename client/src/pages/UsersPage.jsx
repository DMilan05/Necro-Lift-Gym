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
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Vendégek</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-8">
        <input
          className="bg-zinc-900 border border-red-900 p-2 rounded text-white"
          placeholder="Név"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="bg-zinc-900 border border-red-900 p-2 rounded text-white"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <button className="bg-red-800 hover:bg-red-700 text-white py-2 rounded">
          Vendég felvétele
        </button>
      </form>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      <ul className="flex flex-col gap-2">
        {users.map((u) => (
          <li key={u._id} className="border border-zinc-800 p-3 rounded">
            {u.name} — {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersPage;