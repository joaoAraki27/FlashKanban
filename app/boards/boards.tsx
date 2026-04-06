/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { Columns } from "../types";
import { api } from "../lib/api";
import { toast } from "../components/Toast";
import { AddOutline, TimeOutline } from "react-ionicons";
import AddModal, { TaskData } from "../components/Modals/AddModal";
import MoveModal from "../components/Modals/MoveModal";
import CardDetailModal from "../components/Modals/CardDetailModal";
import SideBarHistory from "../components/SideBarHistory";
import Task from "../components/Task";

const Home = ({ boardId }: { boardId: string }) => {
	const [columns, setColumns] = useState<Columns>({});
	const [permission, setPermission] = useState("");
	const [loading, setLoading] = useState(true);
	const [addCol, setAddCol] = useState<string | null>(null);
	const [move, setMove] = useState<{ cardId: number; from: string; to: string; pos: number } | null>(null);
	const [detailId, setDetailId] = useState<number | null>(null);
	const [historyOpen, setHistoryOpen] = useState(false);

	const viewer = permission === "viewer";

	useEffect(() => {
		api(`/boards/${boardId}`)
			.then((r) => r.json())
			.then((d) => {
				if (!d?.columns) return;
				setPermission(d.my_permission || "");
				const cols: Columns = {};
				d.columns.forEach((col: any) => {
					cols[col.id] = { id: col.id, name: col.name, items: col.cards || [], wip_limit: col.wip_limit };
				});
				setColumns(cols);
			})
			.finally(() => setLoading(false));
	}, [boardId]);

	const onDragEnd = (result: any) => {
		if (viewer || !result.destination) return;
		const { source, destination, draggableId } = result;
		if (source.droppableId === destination.droppableId) return;

		setMove({
			cardId: Number(draggableId),
			from: source.droppableId,
			to: destination.droppableId,
			pos: destination.index,
		});
	};

	const confirmMove = async (observation: string) => {
		if (!move) return;

		const res = await api(`/cards/${move.cardId}/move`, {
			method: "POST",
			body: JSON.stringify({ target_column_id: move.to, position: move.pos, observation }),
		});

		if (!res.ok) {
			const e = await res.json().catch(() => null);
			toast(e?.error?.message || "Erro ao mover card");
			setMove(null);
			return;
		}

		setColumns((prev) => {
			const card = prev[move.from].items.find((t) => t.id === move.cardId)!;
			const toItems = [...prev[move.to].items];
			toItems.splice(move.pos, 0, card);
			return {
				...prev,
				[move.from]: { ...prev[move.from], items: prev[move.from].items.filter((t) => t.id !== move.cardId) },
				[move.to]: { ...prev[move.to], items: toItems },
			};
		});
		setMove(null);
	};

	const addTask = async (taskData: TaskData) => {
		if (!addCol) return;
		const col = columns[addCol];

		const res = await api(`/boards/${boardId}/columns/${col.id}/cards`, {
			method: "POST",
			body: JSON.stringify(taskData),
		});
		if (!res.ok) return;

		const card = await res.json();
		setColumns((prev) => ({
			...prev,
			[addCol]: { ...prev[addCol], items: [...prev[addCol].items, card] },
		}));
	};

	if (loading) return <div className="w-full py-20 text-center text-gray-400 text-sm">Carregando board...</div>;
	if (Object.keys(columns).length === 0) return <div className="w-full py-20 text-center text-gray-400 text-sm">Nenhum board encontrado.</div>;

	return (
		<>
			<div className="flex items-center justify-between px-5 mb-2">
				{permission && (
					<span className="text-xs font-semibold px-3 py-1 rounded-md" style={{ backgroundColor: "#fef3c7", color: "#92400e" }}>
						{permission}
					</span>
				)}
				<button
					onClick={() => setHistoryOpen(true)}
					style={{ backgroundColor: "#CC0000" }}
					className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold shadow-md hover:brightness-110"
				>
					<TimeOutline color="#fff" width="18px" height="18px" />
					Atividade
				</button>
			</div>

			<DragDropContext onDragEnd={onDragEnd}>
				<div className="w-full flex items-start px-5 pb-8 gap-4 overflow-x-auto">
					{Object.entries(columns).map(([colId, col]) => (
						<div className="w-full flex flex-col" key={colId}>
							<Droppable droppableId={colId}>
								{(provided) => (
									<div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col md:w-[290px] w-[250px] gap-3 items-center py-5">
										<div className={`flex items-center justify-center gap-2 py-[10px] w-full rounded-lg shadow-sm font-medium text-[15px] ${
											col.wip_limit && col.items.length >= col.wip_limit
												? "bg-red-100 text-red-700 border border-red-300"
												: "bg-white text-[#555]"
										}`}>
											{col.name}
											{col.wip_limit && (
												<span className={`text-xs ${col.items.length >= col.wip_limit ? "text-red-600 font-bold" : "text-gray-400"}`}>
													{col.items.length}/{col.wip_limit}
												</span>
											)}
										</div>

										{col.items.map((task, i) => (
											<Draggable key={task.id} draggableId={String(task.id)} index={i} isDragDisabled={viewer}>
												{(provided) => <Task provided={provided} task={task} onClick={() => setDetailId(task.id)} />}
											</Draggable>
										))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>

							{!viewer && (
								<div onClick={() => setAddCol(colId)} className="flex cursor-pointer items-center justify-center gap-1 py-[10px] md:w-[90%] w-full opacity-90 bg-white rounded-lg shadow-sm text-[#555] font-medium text-[15px]">
									<AddOutline color="#555" />
									Add Task
								</div>
							)}
						</div>
					))}
				</div>
			</DragDropContext>

			<AddModal isOpen={addCol !== null} onClose={() => setAddCol(null)} onSubmit={addTask} />
			<MoveModal isOpen={move !== null} onClose={() => setMove(null)} onConfirm={confirmMove} />
			<CardDetailModal cardId={detailId} onClose={() => setDetailId(null)} />
			<SideBarHistory boardId={boardId} isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />
		</>
	);
};

export default Home;
