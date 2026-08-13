import { useState, useEffect } from 'react';
import { api } from '../api/client';

function FoodLogPage() {
  const [entries, setEntries] = useState([]);
  const [users, setUsers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [form, setForm] = useState({ user: '', name: '', calories: '', protein: '', carbs: '', fat: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [e, u, m] = await Promise.all([api.getFoodEntries(), api.getUsers(), api.getMemberships()]);
      setEntries(e);
      setUsers(u);
      setMemberships(m);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeUserIds = new Set(
    memberships.filter((m) => m.isActive).map((m) => m.user?._id || m.user)
  );
  const eligibleUsers = users.filter((u) => activeUserIds.has(u._id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        user: form.user,
        name: form.name,
        calories: Number(form.calories),
        ...(form.protein && { protein: Number(form.protein) }),
        ...(form.carbs && { carbs: Number(form.carbs) }),
        ...(form.fat && { fat: Number(form.fat) }),
      };
      await api.createFoodEntry(payload);
      setForm((f) => ({ ...f, name: '', calories: '', protein: '', carbs: '', fat: '' }));
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Biztosan törlöd ezt a bejegyzést?')) return;
    try {
      await api.deleteFoodEntry(id);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const isToday = (d) => new Date(d).toDateString() === new Date().toDateString();

  const todaysTotals = entries
    .filter((e) => form.user && (e.user?._id === form.user) && isToday(e.date))
    .reduce(
      (acc, e) => ({
        calories: acc.calories + (e.calories || 0),
        protein: acc.protein + (e.protein || 0),
        carbs: acc.carbs + (e.carbs || 0),
        fat: acc.fat + (e.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

  return (
    <div className="page-shell p-6 max-w-xl mx-auto">
      <h2 className="section-title text-3xl mb-6">Étkezési napló</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
        <select className="input-brutal" value={form.user} onChange={(e) => setForm({ ...form, user: e.target.value })} required>
          <option value="" disabled>Válassz vendéget (csak aktív bérlettel)</option>
          {eligibleUsers.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
        </select>
        {!loading && eligibleUsers.length === 0 && (
          <p className="text-sm" style={{ color: 'var(--color-ash)' }}>
            Jelenleg nincs aktív bérlettel rendelkező vendég.
          </p>
        )}

        <input
          className="input-brutal"
          placeholder="Étel neve"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          className="input-brutal"
          type="number"
          placeholder="Kalória (kcal)"
          value={form.calories}
          onChange={(e) => setForm({ ...form, calories: e.target.value })}
          required
        />

        <div className="flex gap-2">
          <input className="input-brutal" type="number" placeholder="Fehérje (g)" value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} />
          <input className="input-brutal" type="number" placeholder="Szénhidrát (g)" value={form.carbs} onChange={(e) => setForm({ ...form, carbs: e.target.value })} />
          <input className="input-brutal" type="number" placeholder="Zsír (g)" value={form.fat} onChange={(e) => setForm({ ...form, fat: e.target.value })} />
        </div>

        <button className="btn-brutal" disabled={submitting}>
          {submitting ? 'Mentés...' : 'Bejegyzés hozzáadása'}
        </button>
      </form>

      {error && <p className="status-expired mb-4">{error}</p>}

      {form.user && (
        <div className="card-brutal mb-6">
          <p className="section-title text-lg mb-1">Mai összesítés</p>
          <p className="text-sm">
            {todaysTotals.calories} kcal — F: {todaysTotals.protein}g, Sz: {todaysTotals.carbs}g, Zs: {todaysTotals.fat}g
          </p>
        </div>
      )}

      {loading && <p style={{ color: 'var(--color-ash)' }}>Betöltés...</p>}

      {!loading && entries.length === 0 && (
        <p style={{ color: 'var(--color-ash)' }}>Még nincs felvéve bejegyzés.</p>
      )}

      {!loading && entries.length > 0 && (
        <ul className="flex flex-col gap-2">
          {entries.map((e) => (
            <li key={e._id} className="card-brutal flex justify-between items-center">
              <span className="text-sm">
                {e.user?.name} — {e.name} — {e.calories} kcal
                <br />
                <span style={{ color: 'var(--color-ash)' }}>{new Date(e.date).toLocaleDateString('hu-HU')}</span>
              </span>
              <button onClick={() => handleDelete(e._id)} className="icon-btn-brutal">Törlés</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FoodLogPage;