import { useState, useEffect } from 'react';
import { api } from '../api/client';

function MembershipsPage() {
  const [memberships, setMemberships] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ user: '', type: 'felnott', price: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      const [m, u] = await Promise.all([api.getMemberships(), api.getUsers()]);
      setMemberships(m);
      setUsers(u);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, price: Number(form.price) };
      if (editingId) {
        await api.updateMembership(editingId, payload);
        setEditingId(null);
      } else {
        await api.createMembership(payload);
      }
      setForm({ user: '', type: 'felnott', price: '' });
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (m) => {
    setEditingId(m._id);
    setForm({ user: m.user?._id || m.user, type: m.type, price: String(m.price) });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ user: '', type: 'felnott', price: '' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Biztosan törlöd ezt a bérletet?')) return;
    try {
      await api.deleteMembership(id);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('hu-HU');

  return (
    <div className="page-shell p-6 max-w-xl mx-auto">
      <h2 className="section-title text-3xl mb-6">Bérletek</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-8">
        <select className="input-brutal" value={form.user} onChange={(e) => setForm({ ...form, user: e.target.value })} required>
          <option value="" disabled>Válassz vendéget</option>
          {users.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
        </select>

        <select className="input-brutal" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="felnott">Felnőtt</option>
          <option value="diak">Diák</option>
        </select>

        <input
          className="input-brutal"
          type="number"
          placeholder="Ár (Ft)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />

        <div className="flex gap-2">
          <button className="btn-brutal flex-1">
            {editingId ? 'Mentés' : 'Bérlet felvétele (30 napra szól a mai naptól)'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="icon-btn-brutal">Mégse</button>
          )}
        </div>
      </form>

      {error && <p className="status-expired mb-4">{error}</p>}

      <ul className="flex flex-col gap-2">
        {memberships.map((m) => (
          <li key={m._id} className="card-brutal flex justify-between items-center">
            <span>
              {m.user?.name} — {m.type === 'felnott' ? 'Felnőtt' : 'Diák'} — {m.price} Ft
              <br />
              <span className="text-sm" style={{ color: 'var(--color-ash)' }}>Lejárat: {formatDate(m.endDate)}</span>
            </span>
            <span className="flex items-center gap-2">
              <span className={m.isActive ? 'status-active' : 'status-expired'}>
                {m.isActive ? 'Aktív' : 'Lejárt'}
              </span>
              <button onClick={() => startEdit(m)} className="icon-btn-brutal">Szerkesztés</button>
              <button onClick={() => handleDelete(m._id)} className="icon-btn-brutal">Törlés</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MembershipsPage;