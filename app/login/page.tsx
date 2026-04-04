'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TestLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('https://joaocunha.flashnetbrasil.com.br/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error();

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('username', data.user.username);

      router.push('/boards');
    } catch {
      setError('Usuário ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-2xl flex w-[900px] min-h-[520px] overflow-hidden">

        {/* Painel esquerdo */}
        <div
          className="w-2/5 flex flex-col items-center justify-center py-16 px-10 text-white"
          style={{ backgroundColor: '#CC0000' }}
        >
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-center">
            FLASH<br />
            <span style={{ color: '#F5A800' }}>KANBAN</span>
          </h1>
          <div className="w-12 h-0.5 bg-white mt-4 mb-6" />
          <p className="text-sm text-center text-red-100 leading-relaxed">
            Gerencie suas tarefas com agilidade e eficiência.
          </p>
        </div>

        {/* Painel direito — login */}
        <div className="w-3/5 flex flex-col items-center justify-center py-16 px-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Entrar na conta</h2>
          <p className="text-sm text-gray-400 mb-8">Use seu usuário e senha para acessar</p>

          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mb-3 p-3 border border-gray-200 rounded-lg outline-none focus:border-red-600 transition-colors text-sm text-black"
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full mb-6 p-3 border border-gray-200 rounded-lg outline-none focus:border-red-600 transition-colors text-sm text-black"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full text-white p-3 rounded-lg font-semibold transition-opacity hover:opacity-90 text-sm disabled:opacity-60"
            style={{ backgroundColor: '#CC0000' }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          {error && (
            <p className="text-red-600 mt-4 text-sm text-center">{error}</p>
          )}
        </div>

      </div>
    </div>
  );
}
