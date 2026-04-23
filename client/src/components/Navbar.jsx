import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LogoutModal = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
    <div className="glass rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center mb-5 shadow-lg shadow-red-100">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">Signing out?</h2>
      <p className="text-sm text-gray-400 mb-7">You'll need to log back in to access your tasks.</p>
      <div className="flex gap-3 w-full">
        <button onClick={onCancel} className="flex-1 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
          Stay
        </button>
        <button onClick={onConfirm} className="flex-1 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md shadow-red-100 hover:opacity-90 transition">
          Yes, Logout
        </button>
      </div>
    </div>
  </div>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="glass sticky top-0 z-40 px-4 sm:px-6 py-4 mb-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            TaskFlow
          </Link>

          {user && (
            <>
              {/* Desktop nav */}
              <div className="hidden sm:flex items-center gap-4">
                {user.role !== "admin" && (
                  <NavLink to="/" end className={({ isActive }) =>
                    `text-sm font-medium transition ${isActive ? "text-indigo-600" : "text-gray-500 hover:text-gray-800"}`
                  }>
                    My Tasks
                  </NavLink>
                )}
                {user.role === "admin" && (
                  <NavLink to="/admin" className={({ isActive }) =>
                    `text-sm font-medium transition ${isActive ? "text-indigo-600" : "text-gray-500 hover:text-gray-800"}`
                  }>
                    Admin Panel
                  </NavLink>
                )}
                <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium capitalize">
                    {user.role}
                  </span>
                </div>
                <button onClick={() => setShowLogout(true)} className="text-sm text-red-500 hover:text-red-600 font-medium transition">
                  Logout
                </button>
              </div>

              {/* Mobile: avatar + hamburger */}
              <div className="flex sm:hidden items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <button onClick={() => setMenuOpen((v) => !v)} className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-white/60 hover:bg-white/80 transition">
                  <span className={`block w-5 h-0.5 bg-gray-600 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
                  <span className={`block w-5 h-0.5 bg-gray-600 transition-all ${menuOpen ? "opacity-0" : ""}`} />
                  <span className={`block w-5 h-0.5 bg-gray-600 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile dropdown menu */}
        {user && menuOpen && (
          <div className="sm:hidden mt-3 border-t border-white/40 pt-4 flex flex-col gap-3 px-1">
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium capitalize">
                  {user.role}
                </span>
              </div>
            </div>

            {user.role !== "admin" && (
              <NavLink to="/" end onClick={() => setMenuOpen(false)} className={({ isActive }) =>
                `px-3 py-2.5 rounded-xl text-sm font-medium transition ${isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"}`
              }>
                My Tasks
              </NavLink>
            )}
            {user.role === "admin" && (
              <NavLink to="/admin" onClick={() => setMenuOpen(false)} className={({ isActive }) =>
                `px-3 py-2.5 rounded-xl text-sm font-medium transition ${isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"}`
              }>
                Admin Panel
              </NavLink>
            )}

            <button
              onClick={() => { setMenuOpen(false); setShowLogout(true); }}
              className="px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 text-left transition"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {showLogout && (
        <LogoutModal onConfirm={logout} onCancel={() => setShowLogout(false)} />
      )}
    </>
  );
};

export default Navbar;
