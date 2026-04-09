'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE, scheduleRefresh } from '../lib/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.status === 403) throw new Error('Conta desativada');
      if (!res.ok) throw new Error('Usuário ou senha inválidos');

      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('username', data.user.username);
      localStorage.setItem('role', data.user.role || '');
      scheduleRefresh(data.expires_in || 3600);

      router.push('/boards');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row w-full max-w-[900px] mx-4 min-h-[520px] overflow-hidden">
        <div
          className="md:w-2/5 w-full flex flex-col items-center justify-center py-10 md:py-16 px-10 text-white"
          style={{ backgroundColor: '#CC0000' }}
        >
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-center">
            FLASH<br />
            <span style={{ color: '#F5A800' }}>KANBAN</span>
          </h1>
          <div className="w-12 h-0.5 bg-white mt-4 mb-6" />
          <p className="text-sm text-center text-red-100">
            Gerencie suas tarefas com agilidade e eficiência.
          </p>
        </div>

        <div className="md:w-3/5 w-full flex flex-col items-center justify-center py-10 md:py-16 px-8 md:px-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Entrar na conta</h2>
          <p className="text-sm text-gray-400 mb-8">Use seu usuário e senha para acessar</p>

          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mb-3 p-3 border border-gray-200 rounded-lg outline-none focus:border-red-600 text-sm text-black"
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full mb-6 p-3 border border-gray-200 rounded-lg outline-none focus:border-red-600 text-sm text-black"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full text-white p-3 rounded-lg font-semibold hover:opacity-90 text-sm disabled:opacity-60"
            style={{ backgroundColor: '#CC0000' }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          {error && <p className="text-red-600 mt-4 text-sm text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
}
