/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { CloseOutline, TimeOutline } from 'react-ionicons';
import { api } from '../../lib/api';

const actionLabels: Record<string, string> = {
	created: "Criado",
	moved: "Movido",
	edited: "Editado",
	commented: "Comentário",
	assigned: "Responsável atribuído",
	unassigned: "Responsável removido",
	archived: "Excluído",
	priority_changed: "Prioridade alterada",
	due_date_changed: "Data limite alterada",
};

const SideBarHistory = ({ boardId, isOpen, onClose }: { boardId: string; isOpen: boolean; onClose: () => void }) => {
	const [items, setItems] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!isOpen) return;

		setLoading(true);
		api(`/boards/${boardId}/activity`)
			.then((res) => res.json())
			.then((data) => setItems(data.items || []))
			.finally(() => setLoading(false));
	}, [isOpen, boardId]);

	return (
		<div
			className={`fixed top-0 right-0 h-full w-[360px] max-w-[90vw] bg-white border-l border-slate-200 shadow-2xl z-50 transition-transform duration-300 ${
				isOpen ? 'translate-x-0' : 'translate-x-full'
			}`}
		>
			<div
				className="h-[70px] flex items-center justify-between px-5 border-b border-slate-200"
				style={{ backgroundColor: '#CC0000' }}
			>
				<div className="flex items-center gap-2">
					<TimeOutline color="#fff" width="22px" height="22px" />
					<span className="font-bold text-white text-lg">
						ATIVIDADE <span style={{ color: '#F5A800' }}>RECENTE</span>
					</span>
				</div>
				<div onClick={onClose} className="cursor-pointer hover:opacity-80">
					<CloseOutline color="#fff" width="24px" height="24px" />
				</div>
			</div>

			<div className="h-[calc(100%-70px)] overflow-y-auto p-4">
				{loading && <p className="text-sm text-gray-400">Carregando...</p>}
				{!loading && items.length === 0 && <p className="text-sm text-gray-400">Nenhuma atividade.</p>}

				<div className="flex flex-col gap-3">
					{items.map((item) => (
						<div key={item.id} className="border-l-2 pl-3 py-2 bg-slate-50 rounded-r-md" style={{ borderColor: '#CC0000' }}>
							<div className="flex items-center justify-between mb-1">
								<span className="text-xs font-bold text-gray-800 uppercase">{actionLabels[item.action] || item.action}</span>
								<span className="text-[11px] text-gray-400">
									{new Date(item.created_at).toLocaleString("pt-BR")}
								</span>
							</div>
							{item.card?.title && <p className="text-sm font-medium text-gray-700">{item.card.title}</p>}
							{item.from_column && item.to_column && (
								<p className="text-xs text-gray-500 mt-1">{item.from_column} → {item.to_column}</p>
							)}
							{item.observation && (
								<p className="text-xs text-gray-600 mt-1 italic">&ldquo;{item.observation}&rdquo;</p>
							)}
							<p className="text-[11px] text-gray-400 mt-1">
								por <span className="font-semibold">{item.performed_by?.username}</span>
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default SideBarHistory;
