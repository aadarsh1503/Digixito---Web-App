import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import useTasks from "../hooks/useTasks";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import Filters from "../components/Filters";
import Pagination from "../components/Pagination";

const StatBadge = ({ label, count, color }) => (
  <div className="glass rounded-2xl px-5 py-4 flex flex-col gap-1">
    <span className="text-2xl font-bold" style={{ color }}>{count}</span>
    <span className="text-xs text-gray-500 font-medium">{label}</span>
  </div>
);

const Dashboard = () => {
  const [filters, setFilters] = useState({ page: 1, limit: 9 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const { tasks, pagination, loading, error, refetch } = useTasks(filters);

  const openCreate = () => { setEditingTask(null); setModalOpen(true); };
  const openEdit = (task) => { setEditingTask(task); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingTask(null); };

  const handleSubmit = async (form) => {
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, form);
        toast.success("Task updated");
      } else {
        await api.post("/tasks", form);
        toast.success("Task created");
      }
      closeModal();
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Task deleted");
      refetch();
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const todoCount = tasks.filter((t) => t.status === "todo").length;
  const inProgressCount = tasks.filter((t) => t.status === "in-progress").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;

  return (
    <div className="max-w-7xl mx-auto px-4 pb-12">

      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
          <p className="text-gray-500 text-sm mt-1">
            {pagination.total ?? 0} total tasks
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary px-6 py-3 rounded-xl font-semibold text-sm">
          + New Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatBadge label="Todo" count={todoCount} color="#6366f1" />
        <StatBadge label="In Progress" count={inProgressCount} color="#f59e0b" />
        <StatBadge label="Done" count={doneCount} color="#10b981" />
      </div>

      {/* Filters */}
      <div className="mb-6">
        <Filters filters={filters} onChange={setFilters} />
      </div>

      {/* States */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <p className="text-center text-red-400 py-16">{error}</p>
      )}

      {!loading && !error && tasks.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-gray-500 font-medium">No tasks yet. Create your first one.</p>
        </div>
      )}

      {/* Task grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <Pagination
        pagination={pagination}
        onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
      />

      {modalOpen && (
        <TaskModal task={editingTask} onClose={closeModal} onSubmit={handleSubmit} />
      )}
    </div>
  );
};

export default Dashboard;
