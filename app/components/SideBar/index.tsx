'use client';

import { useRouter } from 'next/navigation';
import {
	AppsOutline,
	GridOutline,
	NotificationsOutline,
	PeopleOutline,
	PowerOutline,
} from "react-ionicons";

const Sidebar = () => {
	const router = useRouter();

	const navLinks = [
		{
			title: "Boards",
			icon: <AppsOutline color="#CC0000" width="22px" height="22px" />,
			active: true,
		},
		{
			title: "Projects",
			icon: <GridOutline color="#CC0000" width="22px" height="22px" />,
			active: false,
		},
		{
			title: "Workflows",
			icon: <PeopleOutline color="#CC0000" width="22px" height="22px" />,
			active: false,
		},
		{
			title: "Notifications",
			icon: <NotificationsOutline color="#CC0000" width="22px" height="22px" />,
			active: false,
		},
	];

	const handleLogout = () => {
		localStorage.clear();
		router.push('/login');
	};

	return (
		<div className="fixed left-0 top-0 md:w-[230px] w-[60px] overflow-hidden h-full flex flex-col">
			<div className="w-full flex items-center md:justify-start justify-center md:pl-5 h-[70px] bg-white border-b border-slate-200">
				<span className="md:block hidden font-bold text-2xl tracking-tight">
					<span style={{ color: "#CC0000" }}>FLASH</span>
					<span style={{ color: "#F5A800" }}>KANBAN</span>
				</span>
				<span className="md:hidden block font-bold text-2xl" style={{ color: "#CC0000" }}>F</span>
			</div>
			<div className="w-full h-[calc(100vh-70px)] border-r flex flex-col md:items-start items-center gap-2 border-slate-200 bg-white py-5 md:px-3 px-3 relative">
				{navLinks.map((link) => {
					return (
						<div
							key={link.title}
							className={`flex items-center gap-2 w-full rounded-lg hover:bg-red-100 px-2 py-3 cursor-pointer ${
								link.active ? "bg-red-100" : "bg-transparent"
							}`}
						>
							{link.icon}
							<span className="font-medium text-[15px] md:block hidden text-black">{link.title}</span>
						</div>
					);
				})}
				<div
					onClick={handleLogout}
					className="flex absolute bottom-4 items-center md:justify-start justify-center gap-2 md:w-[90%] w-[70%] rounded-lg px-2 py-3 cursor-pointer hover:opacity-90 transition-opacity"
					style={{ backgroundColor: "#CC0000" }}
				>
					<PowerOutline color="#fff" />
					<span className="font-semibold text-[15px] md:block hidden text-white">
						<span style={{ color: "#fff" }}>LOG </span>
						<span style={{ color: "#F5A800" }}>OUT</span>
					</span>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
