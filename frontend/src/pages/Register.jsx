import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Shield } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Reader');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password, role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account.');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <div className="bg-white dark:bg-zinc-900 p-8 sm:p-10 rounded-3xl shadow-sm border border-zinc-200/80 dark:border-zinc-800 w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-2xl mx-auto shadow-sm">
            N
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Create Account</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Join NovaPost to read and publish stories</p>
        </div>

        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 px-4 py-3 rounded-2xl text-xs font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Full Name</label>
            <div className="relative flex items-center">
              <User size={16} className="absolute left-3.5 text-zinc-400 dark:text-zinc-500" />
              <input
                type="text"
                required
                placeholder="Jane Doe"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-600 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Email Address</label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-3.5 text-zinc-400 dark:text-zinc-500" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-600 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Password</label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3.5 text-zinc-400 dark:text-zinc-500" />
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-600 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Account Type</label>
            <div className="relative flex items-center">
              <Shield size={16} className="absolute left-3.5 text-zinc-400 dark:text-zinc-500" />
              <select
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-600 transition appearance-none cursor-pointer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Reader">Reader (Explore & Comment)</option>
                <option value="Author">Author (Publish Stories)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-3 rounded-xl transition shadow-xs hover:shadow mt-2"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          Already registered?{' '}
          <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
