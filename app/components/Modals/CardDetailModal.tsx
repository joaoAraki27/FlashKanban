/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { api } from "../../lib/api";
import { toast } from "../Toast";

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

const CardDetailModal = ({
	cardId,
	onClose,
	onArchive,
	onUpdate,
	members,
	isViewer,
}: {
	cardId: string | null;
	onClose: () => void;
	onArchive?: (cardId: string) => void;
	onUpdate?: (card: any) => void;
	members?: { id: string; username: string }[];
	isViewer?: boolean;
}) => {
	const [card, setCard] = useState<any>(null);
	const [history, setHistory] = useState<any[]>([]);
	const [comment, setComment] = useState("");
	const [loading, setLoading] = useState(false);
	const [editing, setEditing] = useState(false);
	const [editData, setEditData] = useState({ title: "", description: "", priority: "", due_date: "", assignee_id: "", tags: "" });

	useEffect(() => {
		if (cardId === null) return;

		setLoading(true);
		setEditing(false);
		Promise.all([
			api(`/cards/${cardId}`).then((r) => r.json()),
			api(`/cards/${cardId}/history`).then((r) => r.json()),
		])
			.then(([c, h]) => {
				setCard(c);
				setHistory(h.items || []);
			})
			.finally(() => setLoading(false));
	}, [cardId]);

	const startEdit = () => {
		if (!card) return;
		setEditData({
			title: card.title || "",
			description: card.description || "",
			priority: card.priority || "",
			due_date: card.due_date || "",
			assignee_id: card.assignee?.id || "",
			tags: (card.tags || []).join(", "),
		});
		setEditing(true);
	};

	const saveEdit = async () => {
		if (!cardId || !card) return;
		if (!editData.title.trim()) return toast("Título é obrigatório");

		const payload: Record<string, unknown> = {};
		if (editData.title !== card.title) payload.title = editData.title;
		if (editData.description !== (card.description || "")) payload.description = editData.description;
		if (editData.priority !== card.priority) payload.priority = editData.priority;
		if (editData.due_date !== (card.due_date || "")) {
			payload.due_date = editData.due_date || null;
		}
		if (editData.assignee_id !== (card.assignee?.id || "")) {
			payload.assignee_id = editData.assignee_id || null;
		}
		const newTags = editData.tags.split(",").map((t) => t.trim()).filter(Boolean);
		if (JSON.stringify(newTags) !== JSON.stringify(card.tags || [])) payload.tags = newTags;

		if (Object.keys(payload).length === 0) {
			setEditing(false);
			return;
		}

		const res = await api(`/cards/${cardId}`, {
			method: "PATCH",
			body: JSON.stringify(payload),
		});

		if (!res.ok) {
			const e = await res.json().catch(() => null);
			return toast(e?.detail || "Erro ao editar card");
		}

		const updated = await res.json();
		setCard(updated);
		setEditing(false);
		toast("Card atualizado com sucesso", "success");
		onUpdate?.(updated);

		const hRes = await api(`/cards/${cardId}/history`).then((r) => r.json());
		setHistory(hRes.items || []);
	};

	const archiveCard = async () => {
		if (!cardId) return;
		const res = await api(`/cards/${cardId}`, { method: "DELETE" });
		if (!res.ok) return toast("Erro ao excluir card");
		toast("Card excluído com sucesso", "success");
		onArchive?.(cardId);
		onClose();
	};

	const sendComment = async () => {
		if (!comment.trim() || !cardId) return;

		const res = await api(`/cards/${cardId}/comments`, {
			method: "POST",
			body: JSON.stringify({ observation: comment.trim() }),
		});
		if (!res.ok) return toast("Erro ao comentar");

		const entry = await res.json();
		setHistory((prev) => [entry, ...prev]);
		setComment("");
		toast("Comentário enviado", "success");
	};

	if (cardId === null) return null;

	return (
		<Modal closeModal={onClose}>
			<div style={{ width: "700px", maxWidth: "90vw" }} className="flex flex-col">
				<div className="px-5 py-4 rounded-t-xl" style={{ backgroundColor: "#CC0000" }}>
					<h2 className="text-white font-semibold text-base">Detalhes do Card</h2>
				</div>

				<div className="flex flex-col gap-4 px-5 py-5 overflow-y-auto max-h-[70vh]">
					{loading && <p className="text-sm text-gray-400">Carregando...</p>}

					{!loading && card && !editing && (
						<>
							<div>
								<h3 className="text-lg font-bold text-gray-800">{card.title}</h3>
								<p className="text-sm text-gray-600 mt-1">{card.description || "Sem descrição"}</p>
							</div>

							<div className="grid grid-cols-2 gap-3 text-sm">
								<div>
									<span className="text-xs font-semibold text-gray-500 uppercase">Prioridade</span>
									<p className="text-gray-800">{card.priority}</p>
								</div>
								<div>
									<span className="text-xs font-semibold text-gray-500 uppercase">Coluna</span>
									<p className="text-gray-800">{card.column?.name || "—"}</p>
								</div>
								<div>
									<span className="text-xs font-semibold text-gray-500 uppercase">Responsável</span>
									<p className="text-gray-800">{card.assignee?.username || "—"}</p>
								</div>
								<div>
									<span className="text-xs font-semibold text-gray-500 uppercase">Data limite</span>
									<p className="text-gray-800">{card.due_date || "—"}</p>
								</div>
								<div>
									<span className="text-xs font-semibold text-gray-500 uppercase">Criado por</span>
									<p className="text-gray-800">{card.created_by?.username || "—"}</p>
								</div>
							</div>

							{card.tags?.length > 0 && (
								<div className="flex gap-1 mt-1 flex-wrap">
									{card.tags.map((tag: string) => (
										<span key={tag} className="px-2 py-1 text-xs rounded-md bg-slate-100 text-slate-700">{tag}</span>
									))}
								</div>
							)}
						</>
					)}

					{!loading && card && editing && (
						<div className="flex flex-col gap-3">
							<div className="flex flex-col gap-1">
								<label className="text-xs font-semibold text-gray-800 uppercase">Título *</label>
								<input
									value={editData.title}
									onChange={(e) => setEditData({ ...editData, title: e.target.value })}
									className="w-full h-10 px-3 outline-none rounded-lg bg-slate-50 border border-slate-200 text-sm text-black focus:border-red-600"
								/>
							</div>
							<div className="flex flex-col gap-1">
								<label className="text-xs font-semibold text-gray-800 uppercase">Descrição</label>
								<textarea
									value={editData.description}
									onChange={(e) => setEditData({ ...editData, description: e.target.value })}
									rows={3}
									className="w-full px-3 py-2 outline-none rounded-lg bg-slate-50 border border-slate-200 text-sm text-black focus:border-red-600 resize-none"
								/>
							</div>
							<div className="flex gap-3">
								<div className="flex flex-col gap-1 flex-1">
									<label className="text-xs font-semibold text-gray-800 uppercase">Prioridade</label>
									<select
										value={editData.priority}
										onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
										className="w-full h-10 px-2 outline-none rounded-lg bg-slate-50 border border-slate-200 text-sm text-black focus:border-red-600"
									>
										<option value="low">Baixa</option>
										<option value="medium">Média</option>
										<option value="high">Alta</option>
										<option value="critical">Crítica</option>
									</select>
								</div>
								<div className="flex flex-col gap-1 flex-1">
									<label className="text-xs font-semibold text-gray-800 uppercase">Data limite</label>
									<input
										type="date"
										value={editData.due_date}
										onChange={(e) => setEditData({ ...editData, due_date: e.target.value })}
										className="w-full h-10 px-3 outline-none rounded-lg bg-slate-50 border border-slate-200 text-sm text-black focus:border-red-600"
									/>
								</div>
							</div>
							<div className="flex flex-col gap-1">
								<label className="text-xs font-semibold text-gray-800 uppercase">Responsável</label>
								<select
									value={editData.assignee_id}
									onChange={(e) => setEditData({ ...editData, assignee_id: e.target.value })}
									className="w-full h-10 px-2 outline-none rounded-lg bg-slate-50 border border-slate-200 text-sm text-black focus:border-red-600"
								>
									<option value="">Nenhum</option>
									{members?.map((m) => (
										<option key={m.id} value={m.id}>{m.username}</option>
									))}
								</select>
							</div>
							<div className="flex flex-col gap-1">
								<label className="text-xs font-semibold text-gray-800 uppercase">Tags (separadas por vírgula)</label>
								<input
									value={editData.tags}
									onChange={(e) => setEditData({ ...editData, tags: e.target.value })}
									placeholder="Ex: frontend, auth, bug"
									className="w-full h-10 px-3 outline-none rounded-lg bg-slate-50 border border-slate-200 text-sm text-black focus:border-red-600"
								/>
							</div>
						</div>
					)}

					{!loading && card && !editing && (
						<div className="border-t border-slate-200 pt-4 mt-2">
							<h4 className="text-sm font-bold text-gray-800 mb-2">Adicionar comentário</h4>
							<div className="flex gap-2 mb-4">
								<input
									value={comment}
									onChange={(e) => setComment(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && sendComment()}
									placeholder="Escreva um comentário..."
									className="flex-1 h-10 px-3 outline-none rounded-lg bg-slate-50 border border-slate-200 text-sm text-black focus:border-red-600"
								/>
								<button
									onClick={sendComment}
									disabled={!comment.trim()}
									style={{ backgroundColor: "#F5A800" }}
									className="h-10 px-4 rounded-lg text-white text-sm font-semibold hover:brightness-110 disabled:opacity-50"
								>
									Enviar
								</button>
							</div>

							<h4 className="text-sm font-bold text-gray-800 mb-3">Histórico</h4>
							{history.length === 0 && <p className="text-xs text-gray-400">Nenhuma entrada.</p>}

							<div className="flex flex-col gap-3">
								{history.map((entry) => (
									<div key={entry.id} className="border-l-2 border-red-600 pl-3 py-1">
										<div className="flex items-center justify-between">
											<span className="text-xs font-semibold text-gray-800">
												{actionLabels[entry.action] || entry.action}
												{entry.from_column && entry.to_column && (
													<span className="text-gray-500 font-normal">
														{" "}— {entry.from_column.name || entry.from_column} → {entry.to_column.name || entry.to_column}
													</span>
												)}
											</span>
											<span className="text-xs text-gray-400">
												{new Date(entry.created_at).toLocaleString("pt-BR")}
											</span>
										</div>
										{entry.observation && <p className="text-sm text-gray-600 mt-1">{entry.observation}</p>}
										{entry.metadata && entry.metadata.field && (
											<p className="text-xs text-gray-500 mt-1">
												{entry.metadata.field}: {String(entry.metadata.from || "—")} → {String(entry.metadata.to || "—")}
											</p>
										)}
										<span className="text-xs text-gray-400">por {entry.performed_by?.username}</span>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				<div className="flex justify-center gap-4 p-5 border-t border-slate-100">
					{!isViewer && !editing && onArchive && (
						<button
							onClick={archiveCard}
							className="px-8 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md hover:brightness-110 bg-gray-500 hover:bg-gray-600"
						>
							Excluir
						</button>
					)}
					{!isViewer && !editing && (
						<button
							onClick={startEdit}
							style={{ backgroundColor: "#F5A800" }}
							className="px-8 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md hover:brightness-110"
						>
							Editar
						</button>
					)}
					{editing && (
						<>
							<button
								onClick={() => setEditing(false)}
								className="px-8 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md hover:brightness-110 bg-gray-500"
							>
								Cancelar
							</button>
							<button
								onClick={saveEdit}
								style={{ backgroundColor: "#F5A800" }}
								className="px-8 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md hover:brightness-110"
							>
								Salvar
							</button>
						</>
					)}
					{!editing && (
						<button
							onClick={onClose}
							style={{ backgroundColor: "#CC0000" }}
							className="px-8 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md hover:brightness-110"
						>
							Fechar
						</button>
					)}
				</div>
			</div>
		</Modal>
	);
};

export default CardDetailModal;
