const Pagination = ({ pagination, onPageChange }) => {
  const { page, pages } = pagination;
  if (!pages || pages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="px-4 py-2 text-sm font-medium rounded-xl border border-indigo-100 bg-white text-indigo-600 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        ← Prev
      </button>

      <span className="text-sm text-gray-500 font-medium px-2">
        Page {page} of {pages}
      </span>

      <button
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
        className="px-4 py-2 text-sm font-medium rounded-xl border border-indigo-100 bg-white text-indigo-600 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
