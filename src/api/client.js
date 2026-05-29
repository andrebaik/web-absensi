const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

function getToken() {
  try {
    return JSON.parse(sessionStorage.getItem('asinetkw_user'))?.token || null;
  } catch {
    return null;
  }
}

async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : (getToken() ? { Authorization: `Bearer ${getToken()}` } : {})),
    },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = data?.message || `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export const api = {
  get: (path, token) => apiFetch(path, { token }),
  post: (path, body, token) => apiFetch(path, { method: 'POST', body, token }),
  put: (path, body, token) => apiFetch(path, { method: 'PUT', body, token }),
  del: (path, token) => apiFetch(path, { method: 'DELETE', token }),
  // alias agar sesuai pola penulisan yang diinginkan
  delete: (path, token) => apiFetch(path, { method: 'DELETE', token }),
};


