'use client';

import { useEffect, useState } from 'react';
import { PersonCircle } from "react-ionicons";

const Navbar = () => {
	const [username, setUsername] = useState('');
	const [role, setRole] = useState('');

	useEffect(() => {
		setUsername(localStorage.getItem('username') || '');
		setRole(localStorage.getItem('role') || '');
	}, []);

	return (
		<div className="md:w-[calc(100%-230px)] w-[calc(100%-60px)] fixed flex items-center justify-between pl-2 pr-6 h-[70px] top-0 md:left-[230px] left-[60px] border-b border-slate-200 bg-white">
			<div className="flex items-center gap-3 cursor-pointer">
				<PersonCircle color="#CC0000" width="28px" height="28px" />
				<span className="font-semibold md:text-lg text-sm text-black whitespace-nowrap">
					{username || 'Usuário'}
				</span>
				{role && <span className="text-xs text-gray-400 font-medium">{role}</span>}
			</div>
		</div>
	);
};

export default Navbar;
