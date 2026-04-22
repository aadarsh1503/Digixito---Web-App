import { useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const defaultForm = { title: "", description: "", status: "todo", priority: "medium", dueDate: "" };

const priorityDot = { low: "bg-emerald-400", medium: "bg-amber-400", high: "bg-red-400" };
const statusStyles = {
  todo: "bg-slate-100 text-slate-600",
  "in-progress": "bg-blue-50 text-blue-700",
  done: "bg-emerald-50 text-emerald-700",
};

// Unified modal — handles both create (with user dropdown) and edit
const TaskModal = ({ users, preselectedUser, editingTask, onClose, onDone }) => {
  const isEdit = !!editingTask;

  const [form, setForm] = useState(defaultForm);
  const [userId, setUserId] = useState(preselectedUser?._id || "");
  const [userSearch, setUserSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedUser = users.find((u) => u._id === userId);
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  useEffect(() => {
    if (isEdit) {
      setForm({
        title: editingTask.title || "",
        description: editingTask.description || "",
        status: editingTask.status || "todo",
        priority: editingTask.priority || "medium",
        dueDate: editingTask.dueDate ? editingTask.dueDate.slice(0, 10) : "",
      });
      setUserId(editingTask.user?._id || editingTask.user || "");
    } else {
      setForm(defaultForm);
      setUserId(preselectedUser?._id || "");
    }
    setUserSearch("");
    setDropdownOpen(false);
  }, [editingTask, preselectedUser]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const selectUser = (u) => {
    setUserId(u._id);
    setUserSearch("");
    setDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return toast.error("Please select a user");
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/tasks/admin/${editingTask._id}`, { ...form, user: userId });
        toast.success("Task updated");
      } else {
        await api.post("/tasks/admin/create-for-user", { ...form, userId });
        toast.success("Task assigned");
      }
      onDone();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="glass rounded-3xl shadow-2xl w-full max-w-md p-7">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-800">
            {isEdit ? "Edit Task" : "Assign Task"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition text-sm">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Searchable user selector */}
          <div className="relative">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
              Assign To
            </label>
            <div
              className="input-field flex items-center justify-between cursor-pointer select-none"
              onClick={() => setDropdownOpen((v) => !v)}
            >
              {selectedUser ? (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-700">{selectedUser.name}</span>
                  <span className="text-xs text-gray-400">{selectedUser.email}</span>
                </div>
              ) : (
                <span className="text-sm text-gray-400">Select a user...</span>
              )}
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {dropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white rounded-2xl shadow-xl border border-indigo-50 overflow-hidden">
                <div className="p-2 border-b border-gray-50">
                  <input
                    autoFocus
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full px-3 py-2 text-sm rounded-xl border border-indigo-100 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredUsers.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">No users found</p>
                  ) : (
                    filteredUsers.map((u) => (
                      <div
                        key={u._id}
                        onClick={() => selectUser(u)}
                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-indigo-50 transition ${userId === u._id ? "bg-indigo-50" : ""}`}
                      >
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">{u.name}</p>
                          <p className="text-xs text-gray-400 truncate">{u.email}</p>
                        </div>
                        {userId === u._id && (
                          <svg className="w-4 h-4 text-indigo-500 ml-auto shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Title</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Task title" required className="input-field" />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Optional..." rows={3} className="input-field resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="input-field">
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className="input-field">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Due Date</label>
            <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className="input-field" />
          </div>

          <div className="flex gap-3 mt-1">
            <button type="submit" disabled={loading} className="btn-primary flex-1 py-3 rounded-xl font-semibold text-sm">
              {loading ? "Saving..." : isEdit ? "Update Task" : "Create Task"}
            </button>
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserRow = ({ user, users, onOpenModal, onRefresh }) => {
  const [expanded, setExpanded] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const loadTasks = async () => {
    if (expanded) { setExpanded(false); return; }
    setLoadingTasks(true);
    setExpanded(true);
    try {
      const { data } = await api.get("/tasks/admin/all", { params: { limit: 100 } });
      setTasks(data.tasks.filter((t) => t.user._id === user._id));
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoadingTasks(false);
    }
  };

  const refreshTasks = async () => {
    try {
      const { data } = await api.get("/tasks/admin/all", { params: { limit: 100 } });
      setTasks(data.tasks.filter((t) => t.user._id === user._id));
      onRefresh();
    } catch {
      toast.error("Failed to refresh tasks");
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/admin/${taskId}`);
      toast.success("Task deleted");
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      onRefresh();
    } catch {
      toast.error("Failed to delete task");
    }
  };

  return (
    <div className="card rounded-2xl overflow-hidden">
      <div className="flex items-center gap-4 p-5">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
          <p className="text-xs text-gray-400 truncate">{user.email}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-center hidden sm:block">
            <p className="text-lg font-bold text-indigo-600">{user.taskStats.total}</p>
            <p className="text-xs text-gray-400">Tasks</p>
          </div>
          <div className="text-center hidden sm:block">
            <p className="text-lg font-bold text-emerald-500">{user.taskStats.done}</p>
            <p className="text-xs text-gray-400">Done</p>
          </div>
          <button
            onClick={() => onOpenModal({ preselectedUser: user })}
            className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold"
          >
            + Assign
          </button>
          <button
            onClick={loadTasks}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-indigo-100 text-indigo-600 hover:bg-indigo-50 transition"
          >
            {expanded ? "Hide" : "View Tasks"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-indigo-50 px-5 pb-4">
          {loadingTasks && (
            <div className="flex justify-center py-4">
              <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          )}
          {!loadingTasks && tasks.length === 0 && (
            <p className="text-xs text-gray-400 py-4 text-center">No tasks assigned yet.</p>
          )}
          {!loadingTasks && tasks.map((task) => (
            <div key={task._id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
              <span className={`w-2 h-2 rounded-full shrink-0 ${priorityDot[task.priority]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{task.title}</p>
                {task.description && <p className="text-xs text-gray-400 truncate">{task.description}</p>}
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${statusStyles[task.status]}`}>
                {task.status}
              </span>
              <button
                onClick={() => onOpenModal({ editingTask: { ...task, user: { _id: user._id } }, onDone: refreshTasks })}
                className="text-xs text-indigo-500 hover:text-indigo-700 font-medium transition shrink-0"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                className="text-xs text-red-400 hover:text-red-600 font-medium transition shrink-0"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const { user: adminUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // { preselectedUser?, editingTask?, onDone? }

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users");
      setUsers(data.filter((u) => u._id !== adminUser._id && u.role !== "admin"));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalTasks = users.reduce((acc, u) => acc + u.taskStats.total, 0);
  const totalDone = users.reduce((acc, u) => acc + u.taskStats.done, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} users · {totalTasks} tasks · {totalDone} completed</p>
        </div>
        <button
          onClick={() => setModal({})}
          className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold"
        >
          + Assign Task
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Users", value: users.length, gradient: "from-indigo-500 to-purple-500" },
          { label: "Total Tasks", value: totalTasks, gradient: "from-blue-500 to-indigo-500" },
          { label: "Completed", value: totalDone, gradient: "from-emerald-400 to-teal-500" },
          {
            label: "Completion Rate",
            value: totalTasks ? `${Math.round((totalDone / totalTasks) * 100)}%` : "0%",
            gradient: "from-amber-400 to-orange-500",
          },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-5">
            <p className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
              {stat.value}
            </p>
            <p className="text-xs text-gray-500 mt-1 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users by name or email..."
          className="input-field max-w-sm"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      )}

      {!loading && (
        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-3">👤</p>
              <p className="text-gray-400 font-medium">No users found.</p>
            </div>
          ) : (
            filtered.map((user) => (
              <UserRow
                key={user._id}
                user={user}
                users={users}
                onOpenModal={setModal}
                onRefresh={fetchUsers}
              />
            ))
          )}
        </div>
      )}

      {modal !== null && (
        <TaskModal
          users={users}
          preselectedUser={modal.preselectedUser || null}
          editingTask={modal.editingTask || null}
          onClose={() => setModal(null)}
          onDone={modal.onDone || fetchUsers}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
