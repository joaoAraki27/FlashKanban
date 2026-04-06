'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Sidebar from '../components/SideBar';
import { api } from '../lib/api';

interface Board {
  id: string;
  name: string;
  description: string;
  my_permission: string;
  members_count: number;
  cards_count: number;
}

export default function BoardsListPage() {
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
      return;
    }

    api('/boards')
      .then((res) => res.json())
      .then((data) => setBoards(data.items || []))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      <div className="md:ml-[230px] ml-[60px] mt-[70px] p-5">
        <h1 className="text-2xl font-bold text-gray-800 mb-5">Meus Boards</h1>

        {loading && <p className="text-gray-400 text-sm">Carregando boards...</p>}
        {!loading && boards.length === 0 && (
          <p className="text-gray-400 text-sm">Nenhum board encontrado.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => (
            <div
              key={board.id}
              onClick={() => router.push(`/boards/${board.id}`)}
              className="bg-white rounded-xl shadow-sm p-5 cursor-pointer hover:shadow-md transition-shadow border border-gray-100"
            >
              <h2 className="font-semibold text-lg text-gray-800 mb-1">{board.name}</h2>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                {board.description || 'Sem descrição'}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="px-2 py-1 rounded-md bg-red-50 text-red-700 font-medium">
                  {board.my_permission}
                </span>
                <div className="flex gap-3">
                  <span>{board.members_count} membros</span>
                  <span>{board.cards_count} cards</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
