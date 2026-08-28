import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { LogOut, User, Edit, Search, PlusCircle, LayoutDashboard, Bookmark } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [navSearch, setNavSearch] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/?keyword=${encodeURIComponent(navSearch.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-zinc-200/80">
      <div className="flex items-center justify-between max-w-6xl mx-auto px-4 py-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md group-hover:bg-indigo-700 transition">
            N
          </div>
          <span className="text-2xl font-bold tracking-tight text-zinc-900">
            Nova<span className="text-indigo-600">Post</span>
          </span>
        </Link>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-4">
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center relative">
            <input
              type="text"
              placeholder="Search stories..."
              className="w-48 lg:w-64 pl-9 pr-4 py-1.5 bg-zinc-100/80 border border-zinc-200/80 rounded-full text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:bg-white focus:border-indigo-600 transition"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
            />
            <Search size={14} className="absolute left-3 text-zinc-400" />
          </form>

          {user ? (
            <div className="flex items-center gap-3">
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
                    className="flex items-center gap-1.5 text-zinc-600 hover:text-indigo-600 text-xs font-medium px-3 py-2 rounded-lg hover:bg-zinc-100/80 transition"
                  >
                    <LayoutDashboard size={15} />
                    <span className="hidden md:inline">Dashboard</span>
                  </Link>
                </>
              )}

              <div className="flex items-center gap-2 pl-2 border-l border-zinc-200">
                <span className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5 bg-zinc-100 px-3 py-1.5 rounded-full">
                  <User size={14} className="text-indigo-600" />
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
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
                className="text-xs font-semibold text-zinc-600 hover:text-indigo-600 px-3 py-2 rounded-lg transition"
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
