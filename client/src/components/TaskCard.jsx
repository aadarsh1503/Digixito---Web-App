const priorityStyles = {
  low: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border border-amber-200",
  high: "bg-red-50 text-red-600 border border-red-200",
};

const statusStyles = {
  todo: "bg-slate-100 text-slate-600",
  "in-progress": "bg-blue-50 text-blue-700",
  done: "bg-emerald-50 text-emerald-700",
};

const priorityDot = {
  low: "bg-emerald-400",
  medium: "bg-amber-400",
  high: "bg-red-400",
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <div className="card rounded-2xl p-5 flex flex-col gap-3">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full shrink-0 mt-1 ${priorityDot[task.priority]}`} />
          <h3 className="font-semibold text-gray-800 text-sm leading-snug">{task.title}</h3>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="text-xs text-indigo-500 font-medium hover:text-indigo-700 transition"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="text-xs text-red-400 font-medium hover:text-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{task.description}</p>
      )}

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mt-auto pt-1">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[task.status]}`}>
          {task.status}
        </span>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${priorityStyles[task.priority]}`}>
          {task.priority}
        </span>
        {formattedDate && (
          <span className="text-xs text-gray-400 ml-auto">📅 {formattedDate}</span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
