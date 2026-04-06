import { useState } from "react";
import Modal from "./Modal";

interface MoveModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (observation: string) => void;
}

const MoveModal = ({ isOpen, onClose, onConfirm }: MoveModalProps) => {
	const [observation, setObservation] = useState("");
	const [error, setError] = useState("");

	if (!isOpen) return null;

	const close = () => {
		setObservation("");
		setError("");
		onClose();
	};

	const confirm = () => {
		if (observation.trim().length < 10) {
			setError("A observação deve ter no mínimo 10 caracteres");
			return;
		}
		onConfirm(observation.trim());
		setObservation("");
		setError("");
	};

	return (
		<Modal closeModal={close}>
			<div style={{ width: "550px", maxWidth: "90vw" }} className="flex flex-col">
				<div className="px-5 py-4 rounded-t-xl" style={{ backgroundColor: "#CC0000" }}>
					<h2 className="text-white font-semibold text-base">Mover Card</h2>
				</div>

				<div className="flex flex-col gap-3 px-5 py-5">
					<label className="text-xs font-semibold text-gray-800 uppercase">
						Observação *
					</label>
					<textarea
						value={observation}
						onChange={(e) => {
							setObservation(e.target.value);
							if (error) setError("");
						}}
						placeholder="Descreva o motivo da movimentação (mínimo 10 caracteres)..."
						rows={4}
						className="w-full px-3 py-2 outline-none rounded-lg bg-slate-50 border border-slate-200 text-sm text-black focus:border-red-600 resize-none"
					/>
					{error && <span className="text-xs font-semibold" style={{ color: "#CC0000" }}>{error}</span>}
					<span className="text-xs text-gray-400">{observation.length} caracteres</span>
				</div>

				<div className="flex justify-center gap-10 p-6 border-t border-slate-100">
					<button
						onClick={close}
						style={{ backgroundColor: "#CC0000" }}
						className="px-8 py-3 rounded-xl text-white text-sm font-semibold shadow-md hover:brightness-110"
					>
						Cancelar
					</button>
					<button
						onClick={confirm}
						style={{ backgroundColor: "#F5A800" }}
						className="px-8 py-3 rounded-xl text-white text-sm font-semibold shadow-md hover:brightness-110"
					>
						Confirmar
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default MoveModal;
