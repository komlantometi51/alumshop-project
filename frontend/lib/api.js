const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

function defaultHeaders(token) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getProduits(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/produits?${qs}`);
  return res.json();
}

export async function getProduit(id) {
  const res = await fetch(`${BASE}/produits/${id}`);
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function register(data) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function createCommande(data, token) {
  const res = await fetch(`${BASE}/commandes`, {
    method: 'POST',
    headers: defaultHeaders(token),
    body: JSON.stringify(data),
  });
  return res.json();
}
