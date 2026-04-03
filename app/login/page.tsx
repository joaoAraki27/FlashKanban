'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await fetch('https://joaocunha.flashnetbrasil.com.br/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      console.log('Resposta do login:', data);

      if (!res.ok) throw new Error();

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('username', data.user.username);

      router.push('/boards');
    } catch {
      setError('Usuário ou senha inválidos');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            <span style={{ color: "#CC0000" }}>FLASH</span>
            <span style={{ color: "#F5A800" }}> KANBAN</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1 font-medium tracking-widest uppercase">Brasil</p>
          <div className="w-12 h-0.5 mt-3" style={{ backgroundColor: "#CC0000" }} />
        </div>

        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-3 p-3 border border-gray-200 rounded-lg outline-none focus:border-red-600 transition-colors text-sm"
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-5 p-3 border border-gray-200 rounded-lg outline-none focus:border-red-600 transition-colors text-sm"
        />

        <button
          onClick={handleLogin}
          className="w-full text-white p-3 rounded-lg font-semibold transition-opacity hover:opacity-90 text-sm"
          style={{ backgroundColor: "#CC0000" }}
        >
          Entrar
        </button>

        {error && (
          <p className="text-red-600 mt-3 text-sm text-center">{error}</p>
        )}
      </div>
    </div>
  );
}
