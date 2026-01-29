import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../src/contexts/ThemeContext';
import { useAuth } from '../src/contexts/AuthContext';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-[calc(100vh-80px)] flex items-center justify-center p-4 ${theme === 'vintage' ? 'bg-vintage-bg' : 'bg-slate-50'}`}>
      <div className={`w-full max-w-md p-8 ${theme === 'vintage'
        ? 'bg-vintage-paper shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50'
        : 'bg-white rounded-2xl shadow-xl'
        }`}>
        <div className="text-center mb-8">
          <h2 className={`text-3xl mb-2 ${theme === 'vintage' ? 'font-serif font-bold text-vintage-dark' : 'font-bold text-slate-900'}`}>
            Admin Login
          </h2>
          <p className={`text-sm ${theme === 'vintage' ? 'font-serif italic text-vintage-text/70' : 'text-slate-500'}`}>
            Welcome back. Please enter your details.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className={`block mb-2 text-sm ${theme === 'vintage' ? 'font-serif font-bold uppercase tracking-wider text-xs' : 'font-medium text-slate-700'}`}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="artist@example.com"
              required
              className={`w-full px-4 py-3 outline-none transition-all ${theme === 'vintage'
                ? 'bg-white border-b-2 border-vintage-accent/20 focus:border-vintage-accent font-serif'
                : 'bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                }`}
            />
          </div>

          <div>
            <label className={`block mb-2 text-sm ${theme === 'vintage' ? 'font-serif font-bold uppercase tracking-wider text-xs' : 'font-medium text-slate-700'}`}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={`w-full px-4 py-3 outline-none transition-all ${theme === 'vintage'
                  ? 'bg-white border-b-2 border-vintage-accent/20 focus:border-vintage-accent font-serif'
                  : 'bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 mt-4 transition-all disabled:opacity-50 ${theme === 'vintage'
              ? 'bg-vintage-accent text-white font-serif uppercase tracking-widest hover:bg-vintage-dark shadow-md'
              : 'bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30'
              }`}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/" className={`text-sm flex items-center justify-center gap-2 ${theme === 'vintage' ? 'text-vintage-accent italic font-serif' : 'text-slate-400 hover:text-slate-600'}`}>
            <ArrowLeft size={16} /> Return to Website
          </Link>
        </div>
      </div>
    </div>
  );
};