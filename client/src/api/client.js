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
  if (res.status === 204) return null; // törlésnél nincs body
  return res.json();
}

export const api = {
  getUsers: () => request('/users'),
  createUser: (data) => request('/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id, data) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),

  getMemberships: () => request('/memberships'),
  createMembership: (data) => request('/memberships', { method: 'POST', body: JSON.stringify(data) }),
  updateMembership: (id, data) => request(`/memberships/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMembership: (id) => request(`/memberships/${id}`, { method: 'DELETE' }),

  getWorkoutPlans: () => request('/workout-plans'),
  createWorkoutPlan: (data) => request('/workout-plans', { method: 'POST', body: JSON.stringify(data) }),
  deleteWorkoutPlan: (id) => request(`/workout-plans/${id}`, { method: 'DELETE' }),
};