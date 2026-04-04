import React, { useState } from "react";
import Modal from "./Modal";

interface AddModalProps {
	isOpen: boolean;
	onClose: () => void;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	handleAddTask: (taskData: TaskData) => void;
}

export interface TaskData {
	title: string;
	description: string;
	priority: "low" | "medium" | "high" | "critical" | "";
	due_date: string;
	tags: string[];
	assignee_id: string;
}

const PRIORITY_LABELS: Record<string, { label: string; color: string }> = {
	low:      { label: "Baixa",   color: "#22c55e" },
	medium:   { label: "Média",   color: "#f59e0b" },
	high:     { label: "Alta",    color: "#f97316" },
	critical: { label: "Crítica", color: "#CC0000" },
};

const initialTaskData: TaskData = {
	title: "",
	description: "",
	priority: "",
	due_date: "",
	tags: [],
	assignee_id: "",
};

const AddModal = ({ isOpen, onClose, setOpen, handleAddTask }: AddModalProps) => {
	const [taskData, setTaskData] = useState<TaskData>(initialTaskData);
	const [tagInput, setTagInput] = useState("");
	const [errors, setErrors] = useState<Partial<Record<keyof TaskData, string>>>({});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setTaskData((prev) => ({ ...prev, [name]: value }));
		if (errors[name as keyof TaskData]) {
			setErrors((prev) => ({ ...prev, [name]: undefined }));
		}
	};

	const handleAddTag = () => {
		const tag = tagInput.trim();
		if (tag && !taskData.tags.includes(tag)) {
			setTaskData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
		}
		setTagInput("");
	};

	const handleRemoveTag = (tag: string) => {
		setTaskData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
	};

	const validate = (): boolean => {
		const newErrors: Partial<Record<keyof TaskData, string>> = {};
		if (!taskData.title.trim()) newErrors.title = "Título é obrigatório";
		if (!taskData.priority) newErrors.priority = "Selecione uma prioridade";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const closeModal = () => {
		setOpen(false);
		onClose();
		setTaskData(initialTaskData);
		setErrors({});
		setTagInput("");
	};

	const handleSubmit = () => {
		if (!validate()) return;
		handleAddTask(taskData);
		closeModal();
	};

	if (!isOpen) return null;

	return (
		<Modal closeModal={closeModal}>
			<div style={{ width: '750px', maxWidth: '90vw' }} className="flex flex-col">
				{/* Header */}
				<div
					className="flex items-center justify-between px-5 py-4 rounded-t-xl"
					style={{ backgroundColor: "#CC0000" }}
				>
					<h2 className="text-white font-semibold text-base">Novo Card</h2>
				</div>

				{/* Body */}
				<div className="flex flex-col gap-4 px-5 py-5 overflow-y-auto max-h-[70vh]">
					{/* Título */}
					<div className="flex flex-col gap-1">
						<label className="text-xs font-semibold text-gray-800 uppercase tracking-wide">
							Título <span className="text-red-600">*</span>
						</label>
						<input
							type="text"
							name="title"
							value={taskData.title}
							onChange={handleChange}
							placeholder="Ex: Implementar tela de dashboard"
							className={`w-full h-10 px-3 outline-none rounded-lg bg-slate-50 border text-sm text-black transition-colors focus:border-red-600 ${
								errors.title ? "border-red-400" : "border-slate-200"
							}`}
						/>
						{errors.title && <span className="text-xs font-semibold" style={{ color: '#CC0000' }}>{errors.title}</span>}
					</div>

					{/* Descrição */}
					<div className="flex flex-col gap-1">
						<label className="text-xs font-semibold text-gray-800 uppercase tracking-wide">
							Descrição
						</label>
						<textarea
							name="description"
							value={taskData.description}
							onChange={handleChange}
							placeholder="Descreva o que precisa ser feito..."
							rows={3}
							className="w-full px-3 py-2 outline-none rounded-lg bg-slate-50 border border-slate-200 text-sm text-black transition-colors focus:border-red-600 resize-none"
						/>
					</div>

					{/* Prioridade + Data */}
					<div className="flex gap-3">
						<div className="flex flex-col gap-1 flex-1">
							<label className="text-xs font-semibold text-gray-800 uppercase tracking-wide">
								Prioridade <span className="text-red-600">*</span>
							</label>
							<select
								name="priority"
								value={taskData.priority}
								onChange={handleChange}
								className={`w-full h-10 px-2 outline-none rounded-lg bg-slate-50 border text-sm text-black transition-colors focus:border-red-600 ${
									errors.priority ? "border-red-400" : "border-slate-200"
								}`}
							>
								<option value="">Selecionar...</option>
								{Object.entries(PRIORITY_LABELS).map(([value, { label, color }]) => (
									<option key={value} value={value} style={{ color }}>
										{label}
									</option>
								))}
							</select>
							{errors.priority && <span className="text-xs font-semibold" style={{ color: '#CC0000' }}>{errors.priority}</span>}
						</div>

						<div className="flex flex-col gap-1 flex-1">
							<label className="text-xs font-semibold text-gray-800 uppercase tracking-wide">
								Data limite
							</label>
							<input
								type="date"
								name="due_date"
								value={taskData.due_date}
								onChange={handleChange}
								className="w-full h-10 px-3 outline-none rounded-lg bg-slate-50 border border-slate-200 text-sm text-black transition-colors focus:border-red-600"
							/>
						</div>
					</div>

					{/* Responsável */}
					<div className="flex flex-col gap-1">
						<label className="text-xs font-semibold text-gray-800 uppercase tracking-wide">
							Responsável (username)
						</label>
						<input
							type="text"
							name="assignee_id"
							value={taskData.assignee_id}
							onChange={handleChange}
							placeholder="Ex: alice"
							className="w-full h-10 px-3 outline-none rounded-lg bg-slate-50 border border-slate-200 text-sm text-black transition-colors focus:border-red-600"
						/>
					</div>

					{/* Tags */}
					<div className="flex flex-col gap-1">
						<label className="text-xs font-semibold text-gray-800 uppercase tracking-wide">
							Tags
						</label>
						<div className="flex gap-2">
							<input
								type="text"
								value={tagInput}
								onChange={(e) => setTagInput(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
								placeholder="Ex: frontend"
								className="flex-1 h-10 px-3 outline-none rounded-lg bg-slate-50 border border-slate-200 text-sm text-black transition-colors focus:border-red-600"
							/>
							<button
								onClick={handleAddTag}
								className="h-10 px-4 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-80"
								style={{ backgroundColor: "#F5A800" }}
							>
								+ Add
							</button>
						</div>
						{taskData.tags.length > 0 && (
							<div className="flex flex-wrap gap-1 mt-1">
								{taskData.tags.map((tag) => (
									<span
										key={tag}
										className="flex items-center gap-1 px-2 py-[3px] text-xs font-medium rounded-md bg-slate-100 text-slate-700"
									>
										{tag}
										<button
											onClick={() => handleRemoveTag(tag)}
											className="text-slate-400 hover:text-red-700 transition-colors leading-none"
										>
											×
										</button>
									</span>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Footer */}
				<div style={{ display: 'flex', justifyContent: 'center', gap: '40px', padding: '24px' }} className="border-t border-slate-100">
					<button
						onClick={closeModal}
						style={{ backgroundColor: '#CC0000', padding: '12px 32px', borderRadius: '12px' }}
						className="text-white text-sm font-semibold tracking-wide shadow-md hover:brightness-110 hover:shadow-lg active:scale-95 transition-all"
					>
						Cancelar
					</button>
					<button
						onClick={handleSubmit}
						style={{ backgroundColor: '#F5A800', padding: '12px 32px', borderRadius: '12px' }}
						className="text-white text-sm font-semibold tracking-wide shadow-md hover:brightness-110 hover:shadow-lg active:scale-95 transition-all"
					>
						Criar Card
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default AddModal;
