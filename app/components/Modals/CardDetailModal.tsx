/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { api } from "../../lib/api";
import { toast } from "../Toast";

const CardDetailModal = ({ cardId, onClose }: { cardId: number | null; onClose: () => void }) => {
	const [card, setCard] = useState<any>(null);
	const [history, setHistory] = useState<any[]>([]);
	const [comment, setComment] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (cardId === null) return;

		setLoading(true);
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

					{!loading && card && (
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
							</div>

							{card.tags?.length > 0 && (
								<div className="flex gap-1 mt-1 flex-wrap">
									{card.tags.map((tag: string) => (
										<span key={tag} className="px-2 py-1 text-xs rounded-md bg-slate-100 text-slate-700">{tag}</span>
									))}
								</div>
							)}

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
													{entry.action}
													{entry.from_column && entry.to_column && (
														<span className="text-gray-500 font-normal">
															{" "}— {entry.from_column.name} → {entry.to_column.name}
														</span>
													)}
												</span>
												<span className="text-xs text-gray-400">
													{new Date(entry.created_at).toLocaleString("pt-BR")}
												</span>
											</div>
											{entry.observation && <p className="text-sm text-gray-600 mt-1">{entry.observation}</p>}
											<span className="text-xs text-gray-400">por {entry.performed_by?.username}</span>
										</div>
									))}
								</div>
							</div>
						</>
					)}
				</div>

				<div className="flex justify-center p-5 border-t border-slate-100">
					<button
						onClick={onClose}
						style={{ backgroundColor: "#CC0000" }}
						className="px-8 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md hover:brightness-110"
					>
						Fechar
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default CardDetailModal;
