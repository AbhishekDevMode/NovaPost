import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { LogOut, User, Edit } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                BlogSpace
              </span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user.role === 'Author' && (
                  <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 transition flex items-center gap-1 font-medium">
                    <Edit size={18} /> Dashboard
                  </Link>
                )}
                <div className="flex items-center gap-3 ml-4">
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <User size={16} /> {user.name}
                  </span>
                  <button
                    onClick={logout}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium px-3 py-2 rounded-md transition">
                  Log in
                </Link>
                <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition shadow-md hover:shadow-lg">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
