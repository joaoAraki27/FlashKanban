'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TestPage() {
  const router = useRouter();
  const [token, setToken] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('token');

    if (!stored) {
      router.push('/login');
      return;
    }

    setToken(stored);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Você está logado 😎🔥</h1>
      <div className="bg-gray-100 p-4 rounded-xl w-full max-w-xl break-all">
        <p className="text-xs text-gray-500 mb-1">Token JWT:</p>
        <p className="text-sm font-mono">{token}</p>
      </div>
    </div>
  );
}