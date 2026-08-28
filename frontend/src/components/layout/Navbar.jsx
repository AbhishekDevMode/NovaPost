import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { LogOut, User, Search, PlusCircle, LayoutDashboard, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [navSearch, setNavSearch] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/?keyword=${encodeURIComponent(navSearch.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors duration-200">
      <div className="flex items-center justify-between max-w-6xl mx-auto px-4 py-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md group-hover:bg-indigo-700 transition">
            N
          </div>
          <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Nova<span className="text-indigo-600 dark:text-indigo-400">Post</span>
          </span>
        </Link>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center relative">
            <input
              type="text"
              placeholder="Search stories..."
              className="w-44 lg:w-64 pl-9 pr-4 py-1.5 bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 rounded-full text-xs text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-600 transition"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
            />
            <Search size={14} className="absolute left-3 text-zinc-400 dark:text-zinc-500" />
          </form>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors flex items-center justify-center"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun size={18} className="text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon size={18} className="text-zinc-600 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {user.role === 'Author' && (
                <>
                  <Link
                    to="/editor"
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-full shadow-sm hover:shadow transition"
                  >
                    <PlusCircle size={15} />
                    <span>Write</span>
                  </Link>

                  <Link
                    to="/dashboard"
                    className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-medium px-3 py-2 rounded-lg hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80 transition"
                  >
                    <LayoutDashboard size={15} />
                    <span className="hidden md:inline">Dashboard</span>
                  </Link>
                </>
              )}

              <div className="flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200 flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full">
                  <User size={14} className="text-indigo-600 dark:text-indigo-400" />
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-full transition"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-lg transition"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-sm hover:shadow transition"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
