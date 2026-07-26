import { useState, useEffect } from 'react';
import { api } from '../api/client';

function MembershipsPage() {
  const [memberships, setMemberships] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ user: '', type: 'felnott', price: '' });
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
      await api.createMembership({ ...form, price: Number(form.price) });
      setForm({ user: '', type: 'felnott', price: '' });
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

        <button className="btn-brutal">Bérlet felvétele (30 napra szól a mai naptól)</button>
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
            <span className={m.isActive ? 'status-active' : 'status-expired'}>
              {m.isActive ? 'Aktív' : 'Lejárt'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MembershipsPage;