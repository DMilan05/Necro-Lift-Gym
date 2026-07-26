import { useState, useEffect } from 'react';
import { api } from '../api/client';

const emptySet = () => ({ weight: '', reps: '', toFailure: false });
const emptyExercise = () => ({ name: '', sets: [emptySet()] });
const emptyDay = () => ({ day: '', exercises: [emptyExercise()] });

const SPLIT_LABELS = {
  bro_split: 'Bro Split',
  upper_lower: 'Upper-Lower',
  ppl: 'Push-Pull-Legs',
  ppl_ul: 'PPL + Upper-Lower',
  egyeb: 'Egyéb',
};

function WorkoutPlansPage() {
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    user: '',
    title: '',
    splitType: 'upper_lower',
    customSplitType: '',
    days: [emptyDay()],
  });

  const loadData = async () => {
    try {
      const [p, u] = await Promise.all([api.getWorkoutPlans(), api.getUsers()]);
      setPlans(p);
      setUsers(u);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- Napok kezelése ---
  const addDay = () => setForm((p) => ({ ...p, days: [...p.days, emptyDay()] }));
  const removeDay = (di) =>
    setForm((p) => ({ ...p, days: p.days.filter((_, i) => i !== di) }));
  const updateDayLabel = (di, value) =>
    setForm((p) => {
      const days = [...p.days];
      days[di] = { ...days[di], day: value };
      return { ...p, days };
    });

  // --- Gyakorlatok kezelése ---
  const addExercise = (di) =>
    setForm((p) => {
      const days = [...p.days];
      days[di] = { ...days[di], exercises: [...days[di].exercises, emptyExercise()] };
      return { ...p, days };
    });
  const removeExercise = (di, ei) =>
    setForm((p) => {
      const days = [...p.days];
      days[di] = { ...days[di], exercises: days[di].exercises.filter((_, i) => i !== ei) };
      return { ...p, days };
    });
  const updateExerciseName = (di, ei, value) =>
    setForm((p) => {
      const days = [...p.days];
      const exercises = [...days[di].exercises];
      exercises[ei] = { ...exercises[ei], name: value };
      days[di] = { ...days[di], exercises };
      return { ...p, days };
    });

  // --- Szettek kezelése ---
  const addSet = (di, ei) =>
    setForm((p) => {
      const days = [...p.days];
      const exercises = [...days[di].exercises];
      exercises[ei] = { ...exercises[ei], sets: [...exercises[ei].sets, emptySet()] };
      days[di] = { ...days[di], exercises };
      return { ...p, days };
    });
  const removeSet = (di, ei, si) =>
    setForm((p) => {
      const days = [...p.days];
      const exercises = [...days[di].exercises];
      exercises[ei] = { ...exercises[ei], sets: exercises[ei].sets.filter((_, i) => i !== si) };
      days[di] = { ...days[di], exercises };
      return { ...p, days };
    });
  const updateSet = (di, ei, si, field, value) =>
    setForm((p) => {
      const days = [...p.days];
      const exercises = [...days[di].exercises];
      const sets = [...exercises[ei].sets];
      sets[si] = { ...sets[si], [field]: value };
      exercises[ei] = { ...exercises[ei], sets };
      days[di] = { ...days[di], exercises };
      return { ...p, days };
    });

  const resetForm = () =>
    setForm({ user: form.user, title: '', splitType: 'upper_lower', customSplitType: '', days: [emptyDay()] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        user: form.user,
        title: form.title,
        splitType: form.splitType,
        ...(form.splitType === 'egyeb' && { customSplitType: form.customSplitType }),
        days: form.days.map((day) => ({
          day: day.day,
          exercises: day.exercises.map((ex) => ({
            name: ex.name,
            sets: ex.sets.map((s) => ({
              weight: Number(s.weight),
              toFailure: s.toFailure,
              ...(!s.toFailure && { reps: Number(s.reps) }),
            })),
          })),
        })),
      };
      await api.createWorkoutPlan(payload);
      resetForm();
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const inputClass = 'input-brutal';

  return (
    <div className="page-shell p-6 max-w-3xl mx-auto">
      <h2 className="section-title text-3xl mb-6">Edzéstervek</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-10">
        <select className={inputClass} value={form.user} onChange={(e) => setForm({ ...form, user: e.target.value })} required>
          <option value="" disabled>Válassz vendéget</option>
          {users.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
        </select>

        <input
          className={inputClass}
          placeholder="Terv neve (pl. Saját Upper/Lower splitem)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <select className={inputClass} value={form.splitType} onChange={(e) => setForm({ ...form, splitType: e.target.value })}>
          {Object.entries(SPLIT_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        {form.splitType === 'egyeb' && (
          <input
            className={inputClass}
            placeholder="Írd le a saját split típusod"
            value={form.customSplitType}
            onChange={(e) => setForm({ ...form, customSplitType: e.target.value })}
            required
          />
        )}

        {form.days.map((day, di) => (
          <div key={di} className="card-brutal flex flex-col gap-3">
            <div className="flex gap-2">
              <input
                className={inputClass}
                placeholder="Nap címke (pl. Hétfő - Upper A)"
                value={day.day}
                onChange={(e) => updateDayLabel(di, e.target.value)}
                required
              />
              {form.days.length > 1 && (
                <button type="button" onClick={() => removeDay(di)} className="icon-btn-brutal">✕</button>
              )}
            </div>

            {day.exercises.map((ex, ei) => (
              <div key={ei} className="card-brutal flex flex-col gap-2 ml-4">
                <div className="flex gap-2">
                  <input
                    className={inputClass}
                    placeholder="Gyakorlat neve"
                    value={ex.name}
                    onChange={(e) => updateExerciseName(di, ei, e.target.value)}
                    required
                  />
                  {day.exercises.length > 1 && (
                    <button type="button" onClick={() => removeExercise(di, ei)} className="icon-btn-brutal">✕</button>
                  )}
                </div>

                {ex.sets.map((s, si) => (
                  <div key={si} className="flex gap-2 items-center ml-4">
                    <input
                      className="input-brutal"
                      style={{ width: '6rem' }}
                      type="number"
                      placeholder="kg"
                      value={s.weight}
                      onChange={(e) => updateSet(di, ei, si, 'weight', e.target.value)}
                      required
                    />
                    {!s.toFailure && (
                      <input
                        className="input-brutal"
                        style={{ width: '6rem' }}
                        type="number"
                        placeholder="ismétlés"
                        value={s.reps}
                        onChange={(e) => updateSet(di, ei, si, 'reps', e.target.value)}
                        required
                      />
                    )}
                    <label className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-ash)' }}>
                      <input
                        type="checkbox"
                        checked={s.toFailure}
                        onChange={(e) => updateSet(di, ei, si, 'toFailure', e.target.checked)}
                      />
                      bukásig
                    </label>
                    {ex.sets.length > 1 && (
                      <button type="button" onClick={() => removeSet(di, ei, si)} style={{ color: 'var(--color-blood)' }}>✕</button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addSet(di, ei)}
                  className="text-sm ml-4 self-start"
                  style={{ color: 'var(--color-blood)' }}
                >
                  + Szett hozzáadása
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addExercise(di)}
              className="text-sm ml-4 self-start"
              style={{ color: 'var(--color-blood)' }}
            >
              + Gyakorlat hozzáadása
            </button>
          </div>
        ))}

        <button type="button" onClick={addDay} className="icon-btn-brutal w-full text-center">
          + Nap hozzáadása
        </button>

        <button className="btn-brutal">Edzésterv mentése</button>
      </form>

      {error && <p className="status-expired mb-4">{error}</p>}

      <div className="flex flex-col gap-4">
        {plans.map((plan) => (
          <div key={plan._id} className="card-brutal">
            <h3 className="section-title text-xl">{plan.title}</h3>
            <p className="text-sm mb-2" style={{ color: 'var(--color-ash)' }}>
              {plan.user?.name} — {plan.splitType === 'egyeb' ? plan.customSplitType : SPLIT_LABELS[plan.splitType]}
            </p>
            {plan.days.map((day, di) => (
              <div key={di} className="mb-2">
                <p className="font-semibold">{day.day}</p>
                {day.exercises.map((ex, ei) => (
                  <p key={ei} className="text-sm ml-3">
                    {ex.name}: {ex.sets.map((s, si) => (
                      <span key={si}>
                        {s.weight}kg × {s.toFailure ? 'bukásig' : s.reps}{si < ex.sets.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </p>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkoutPlansPage;