const Task = ({ task, provided }: any) => {
	return (
		<div
			ref={provided.innerRef}
			{...provided.draggableProps}
			{...provided.dragHandleProps}
			className="w-full cursor-grab bg-white shadow-sm rounded-xl px-3 py-4 flex flex-col gap-2"
		>
			<span className="text-[15px] font-medium text-[#555]">{task.title}</span>
			<span className="text-[13px] text-gray-400">{task.description}</span>
		</div>
	);
};

export default Task;
