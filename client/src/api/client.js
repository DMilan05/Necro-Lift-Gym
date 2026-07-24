const BASE_URL = 'http://localhost:5000/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Hiba: ${res.status}`);
  }
  return res.json();
}

export const api = {
  getUsers: () => request('/users'),
  createUser: (data) => request('/users', { method: 'POST', body: JSON.stringify(data) }),

  getMemberships: () => request('/memberships'),
  createMembership: (data) => request('/memberships', { method: 'POST', body: JSON.stringify(data) }),

  getWorkoutPlans: () => request('/workout-plans'),
  createWorkoutPlan: (data) => request('/workout-plans', { method: 'POST', body: JSON.stringify(data) }),
};