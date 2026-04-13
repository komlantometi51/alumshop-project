'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { login as apiLogin } from '@/lib/api';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const data = await apiLogin(form.email, form.password);
    if (!data.token) {
      setError(data.error || 'Erreur de connexion');
      return;
    }
    login(data.token, data.client);
    router.push('/');
  }

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-semibold mb-8">Connexion</h1>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          className="w-full border rounded-xl px-4 py-3 text-sm"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          required
          value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          className="w-full border rounded-xl px-4 py-3 text-sm"
        />
        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-3 rounded-xl font-medium hover:bg-blue-800"
        >
          Se connecter
        </button>
      </form>
    </main>
  );
}
