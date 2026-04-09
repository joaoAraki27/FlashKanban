import { useState } from "react";
import Modal from "./Modal";

export interface TaskData {
	title: string;
	description: string;
	priority: "low" | "medium" | "high" | "critical" | "";
	due_date: string;
	tags: string[];
	assignee_id: string;
}

const AddModal = ({ isOpen, onClose, onSubmit, members }: {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: TaskData) => void;
	members: { id: string; username: string }[];
}) => {
	const [data, setData] = useState<TaskData>({
		title: "", description: "", priority: "", due_date: "", tags: [], assignee_id: "",
	});
	const [tagInput, setTagInput] = useState("");
	const [error, setError] = useState("");

	if (!isOpen) return null;

	const close = () => {
		setData({ title: "", description: "", priority: "", due_date: "", tags: [], assignee_id: "" });
		setTagInput("");
		setError("");
		onClose();
	};

	const addTag = () => {
		const t = tagInput.trim();
		if (t && !data.tags.includes(t)) setData({ ...data, tags: [...data.tags, t] });
		setTagInput("");
	};

	const submit = () => {
		if (!data.title.trim()) return setError("Título é obrigatório");
		if (!data.priority) return setError("Selecione uma prioridade");
		onSubmit(data);
		close();
	};

	return (
		<Modal closeModal={close}>
			<div style={{ width: "750px", maxWidth: "90vw" }} className="flex flex-col">
				<div className="px-5 py-4 rounded-t-xl" style={{ backgroundColor: "#CC0000" }}>
					<h2 className="text-white font-semibold text-base">Novo Card</h2>
				</div>

				<div className="flex flex-col gap-4 px-5 py-5 overflow-y-auto max-h-[70vh]">
					<div className="flex flex-col gap-1">
						<label className="text-xs font-semibold text-gray-800 uppercase tracking-wide">Título *</label>
						<input
							value={data.title}
							onChange={(e) => setData({ ...data, title: e.target.value })}
							placeholder="Ex: Implementar tela de dashboard"
							className="w-full h-10 px-3 outline-none rounded-lg bg-slate-50 border border-slate-200 text-sm text-black focus:border-red-600"
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-xs font-semibold text-gray-800 uppercase tracking-wide">Descrição</label>
						<textarea
							value={data.description}
							onChange={(e) => setData({ ...data, description: e.target.value })}
							rows={3}
							placeholder="Descreva o que precisa ser feito..."
							className="w-full px-3 py-2 outline-none rounded-lg bg-slate-50 border border-slate-200 text-sm text-black focus:border-red-600 resize-none"
						/>
					</div>

					<div className="flex gap-3">
						<div className="flex flex-col gap-1 flex-1">
							<label className="text-xs font-semibold text-gray-800 uppercase tracking-wide">Prioridade *</label>
							<select
								value={data.priority}
								onChange={(e) => setData({ ...data, priority: e.target.value as TaskData["priority"] })}
								className="w-full h-10 px-2 outline-none rounded-lg bg-slate-50 border border-slate-200 text-sm text-black focus:border-red-600"
							>
								<option value="">Selecionar...</option>
								<option value="low">Baixa</option>
								<option value="medium">Média</option>
								<option value="high">Alta</option>
								<option value="critical">Crítica</option>
							</select>
						</div>

						<div className="flex flex-col gap-1 flex-1">
							<label className="text-xs font-semibold text-gray-800 uppercase tracking-wide">Data limite</label>
							<input
								type="date"
								value={data.due_date}
								onChange={(e) => setData({ ...data, due_date: e.target.value })}
								className="w-full h-10 px-3 outline-none rounded-lg bg-slate-50 border border-slate-200 text-sm text-black focus:border-red-600"
							/>
						</div>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-xs font-semibold text-gray-800 uppercase tracking-wide">Responsável</label>
						<select
							value={data.assignee_id}
							onChange={(e) => setData({ ...data, assignee_id: e.target.value })}
							className="w-full h-10 px-2 outline-none rounded-lg bg-slate-50 border border-slate-200 text-sm text-black focus:border-red-600"
						>
							<option value="">Nenhum</option>
							{members.map((m) => (
								<option key={m.id} value={m.id}>{m.username}</option>
							))}
						</select>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-xs font-semibold text-gray-800 uppercase tracking-wide">Tags</label>
						<div className="flex gap-2">
							<input
								value={tagInput}
								onChange={(e) => setTagInput(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && addTag()}
								placeholder="Ex: frontend"
								className="flex-1 h-10 px-3 outline-none rounded-lg bg-slate-50 border border-slate-200 text-sm text-black focus:border-red-600"
							/>
							<button
								onClick={addTag}
								className="h-10 px-4 rounded-lg text-white text-sm font-semibold hover:opacity-80"
								style={{ backgroundColor: "#F5A800" }}
							>
								+ Add
							</button>
						</div>
						{data.tags.length > 0 && (
							<div className="flex flex-wrap gap-1 mt-1">
								{data.tags.map((tag) => (
									<span key={tag} className="flex items-center gap-1 px-2 py-[3px] text-xs font-medium rounded-md bg-slate-100 text-slate-700">
										{tag}
										<button onClick={() => setData({ ...data, tags: data.tags.filter((t) => t !== tag) })} className="text-slate-400 hover:text-red-700">×</button>
									</span>
								))}
							</div>
						)}
					</div>

					{error && <span className="text-xs font-semibold" style={{ color: "#CC0000" }}>{error}</span>}
				</div>

				<div className="flex justify-center gap-10 p-6 border-t border-slate-100">
					<button onClick={close} style={{ backgroundColor: "#CC0000" }} className="px-8 py-3 rounded-xl text-white text-sm font-semibold shadow-md hover:brightness-110">Cancelar</button>
					<button onClick={submit} style={{ backgroundColor: "#F5A800" }} className="px-8 py-3 rounded-xl text-white text-sm font-semibold shadow-md hover:brightness-110">Criar Card</button>
				</div>
			</div>
		</Modal>
	);
};

export default AddModal;
