'use client';

import { useEffect, useState } from 'react';

type ToastType = 'error' | 'success';

interface ToastMessage {
	id: number;
	text: string;
	type: ToastType;
}

let addToast: (text: string, type: ToastType) => void = () => {};

export function toast(text: string, type: ToastType = 'error') {
	addToast(text, type);
}

const ToastContainer = () => {
	const [toasts, setToasts] = useState<ToastMessage[]>([]);

	useEffect(() => {
		addToast = (text, type) => {
			const id = Date.now();
			setToasts((prev) => [...prev, { id, text, type }]);
			setTimeout(() => {
				setToasts((prev) => prev.filter((t) => t.id !== id));
			}, 4000);
		};
	}, []);

	return (
		<div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
			{toasts.map((t) => (
				<div
					key={t.id}
					className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white animate-slide-in ${
						t.type === 'error' ? 'bg-red-600' : 'bg-green-600'
					}`}
				>
					{t.text}
				</div>
			))}
		</div>
	);
};

export default ToastContainer;
