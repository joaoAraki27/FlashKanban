'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TestPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    // proteção básica
    if (!token) {
      router.push('/login');
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">
        Você está logado 😎🔥
      </h1>
    </div>
  );
}