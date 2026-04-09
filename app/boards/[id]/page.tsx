'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { initTokenRefresh } from '../../lib/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/SideBar';
import Boards from '../boards';

export default function BoardPage() {
  const router = useRouter();
  const params = useParams();
  const boardId = params.id as string;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
    else initTokenRefresh();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      <div className="md:ml-[230px] ml-[60px] mt-[70px] p-5">
        <Boards boardId={boardId} />
      </div>
    </div>
  );
}
