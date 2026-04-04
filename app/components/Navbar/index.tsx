'use client';

import { useEffect, useState } from 'react';
import {
	ChevronDown,
	PersonCircle,
	SearchOutline,
} from "react-ionicons";

const Navbar = () => {
	const [username, setUsername] = useState('');

	useEffect(() => {
		const stored = localStorage.getItem('username');
		// eslint-disable-next-line react-hooks/set-state-in-effect
		if (stored) setUsername(stored);
	}, []);

	return (
		<div className="md:w-[calc(100%-230px)] w-[calc(100%-60px)] fixed grid grid-cols-3 items-center pl-2 pr-6 h-[70px] top-0 md:left-[230px] left-[60px] border-b border-slate-200 bg-white">
			<div className="flex items-center gap-3 cursor-pointer">
				<PersonCircle
					color="#CC0000"
					width={"28px"}
					height={"28px"}
				/>
				<span className="font-semibold md:text-lg text-sm whitespace-nowrap text-black">
					{username || 'Usuário'}
				</span>
				<ChevronDown
					color="#CC0000"
					width={"16px"}
					height={"16px"}
				/>
			</div>
			<div className="bg-gray-100 rounded-lg px-3 py-[10px] flex items-center gap-2">
				<SearchOutline color={"#999"} />
				<input
					type="text"
					placeholder="Search"
					className="w-full bg-gray-100 outline-none text-[15px] text-black"
				/>
			</div>
		</div>
	);
};

export default Navbar;
