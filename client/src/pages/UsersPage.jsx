import { useState, useEffect } from 'react';
import { api } from '../api/client';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [editingId, setEditingId] = useState(null);
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
      if (editingId) {
        await api.updateUser(editingId, form);
        setEditingId(null);
      } else {
        await api.createUser(form);
      }
      setForm({ name: '', email: '' });
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (user) => {
    setEditingId(user._id);
    setForm({ name: user.name, email: user.email });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', email: '' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Biztosan törlöd ezt a vendéget?')) return;
    try {
      await api.deleteUser(id);
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
        <div className="flex gap-2">
          <button className="btn-brutal flex-1">
            {editingId ? 'Mentés' : 'Vendég felvétele'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="icon-btn-brutal">
              Mégse
            </button>
          )}
        </div>
      </form>

      {error && <p className="status-expired mb-4">{error}</p>}

      <ul className="flex flex-col gap-2">
        {users.map((u) => (
          <li key={u._id} className="card-brutal flex justify-between items-center">
            <span>{u.name} — {u.email}</span>
            <span className="flex gap-2">
              <button onClick={() => startEdit(u)} className="icon-btn-brutal">Szerkesztés</button>
              <button onClick={() => handleDelete(u._id)} className="icon-btn-brutal">Törlés</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersPage;