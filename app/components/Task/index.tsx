/* eslint-disable @typescript-eslint/no-explicit-any */
import { TimeOutline } from "react-ionicons";
import { Task as TaskType } from "../../types";

interface TaskProps {
	task: TaskType;
	provided: any;
	onClick?: () => void;
}

const PRIORITY_COLOR: Record<string, string> = {
	high: "bg-red-500",
	medium: "bg-orange-500",
	low: "bg-blue-500",
	critical: "bg-red-700",
};

const Task = ({ task, provided, onClick }: TaskProps) => {
	const { title, description, priority, due_date, tags } = task;

	return (
		<div
			ref={provided.innerRef}
			{...provided.draggableProps}
			{...provided.dragHandleProps}
			onClick={onClick}
			className="w-full cursor-grab bg-white flex flex-col gap-3 shadow-sm rounded-xl px-3 py-4 hover:shadow-md transition-shadow"
		>
			{tags && tags.length > 0 && (
				<div className="flex items-center gap-2 flex-wrap">
					{tags.map((tag: any, i: number) => (
						<span
							key={i}
							className="px-[10px] py-[2px] text-[13px] font-medium rounded-md bg-slate-100 text-slate-700"
						>
							{typeof tag === "string" ? tag : tag.title}
						</span>
					))}
				</div>
			)}

			<div className="flex flex-col">
				<span className="text-[15.5px] font-medium text-[#555]">{title}</span>
				<span className="text-[13.5px] text-gray-500">{description}</span>
			</div>

			<div className="w-full border border-dashed"></div>

			<div className="flex items-center justify-between">
				<div className="flex items-center gap-1">
					<TimeOutline color="#666" width="19px" height="19px" />
					<span className="text-[13px] text-gray-700">{due_date}</span>
				</div>
				<div className={`w-[60px] rounded-full h-[5px] ${PRIORITY_COLOR[priority] || "bg-blue-500"}`} />
			</div>
		</div>
	);
};

export default Task;
