const Filters = ({ filters, onChange }) => {
  const handle = (e) =>
    onChange({ ...filters, [e.target.name]: e.target.value, page: 1 });

  return (
    <div className="glass rounded-2xl px-5 py-4 flex flex-wrap gap-3 items-center">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Filter</span>

      <select name="status" value={filters.status || ""} onChange={handle} className="input-field !w-auto !py-2 !px-3 text-sm">
        <option value="">All Status</option>
        <option value="todo">Todo</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <select name="priority" value={filters.priority || ""} onChange={handle} className="input-field !w-auto !py-2 !px-3 text-sm">
        <option value="">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide ml-2">Sort</span>

      <select name="sortBy" value={filters.sortBy || "createdAt"} onChange={handle} className="input-field !w-auto !py-2 !px-3 text-sm">
        <option value="createdAt">Date Created</option>
        <option value="dueDate">Due Date</option>
        <option value="priority">Priority</option>
      </select>

      <select name="order" value={filters.order || "desc"} onChange={handle} className="input-field !w-auto !py-2 !px-3 text-sm">
        <option value="desc">Newest First</option>
        <option value="asc">Oldest First</option>
      </select>
    </div>
  );
};

export default Filters;
