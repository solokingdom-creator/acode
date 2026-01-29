
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../src/contexts/ThemeContext';
import { Sun, Moon, Menu, X, BookOpen, User, Briefcase, LayoutGrid, LogOut } from 'lucide-react';

export const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = location.pathname.startsWith('/admin');

  // Styles based on theme
  const containerClass = theme === 'vintage'
    ? 'min-h-screen bg-vintage-bg text-vintage-text font-serif vintage-texture'
    : 'min-h-screen bg-nordic-bg text-nordic-text font-sans';

  const navClass = theme === 'vintage'
    ? 'border-b border-vintage-accent/20 bg-vintage-paper/90 backdrop-blur-sm sticky top-0 z-50'
    : 'border-b border-slate-100 bg-white/90 backdrop-blur-sm sticky top-0 z-50';

  const linkClass = (path: string) => {
    const isActive = location.pathname === path;
    if (theme === 'vintage') {
      return `px-4 py-2 transition-colors duration-300 font-serif italic ${isActive ? 'text-vintage-accent font-bold' : 'text-vintage-text hover:text-vintage-accent'}`;
    }
    return `px-4 py-2 transition-colors duration-200 font-medium text-sm rounded-full ${isActive ? 'bg-nordic-surface text-nordic-accent' : 'text-slate-600 hover:text-nordic-text'}`;
  };

  const logoText = theme === 'vintage' ? 'The Archivist’s Collection' : '一名创作者';

  if (isAdmin && location.pathname !== '/admin/login') {
    return <AdminLayout>{children}</AdminLayout>;
  }

  return (
    <div className={containerClass}>
      <nav className={navClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              {theme === 'vintage' ? (
                <BookOpen className="w-6 h-6 text-vintage-accent" />
              ) : (
                <div className="w-8 h-8 bg-nordic-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">创</span>
                </div>
              )}
              <span className={`text-xl ${theme === 'vintage' ? 'font-serif font-bold tracking-tight' : 'font-sans font-bold tracking-tight'}`}>
                {logoText}
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2">
              <Link to="/" className={linkClass('/')}>主页</Link>
              <Link to="/gallery" className={linkClass('/gallery')}>画廊</Link>
              <Link to="/photowall" className={linkClass('/photowall')}>照片墙</Link>
              <Link to="/admin/login" className={linkClass('/admin/login')}>Login</Link>

              <button
                onClick={toggleTheme}
                className={`ml-4 p-2 rounded-full transition-colors ${theme === 'vintage' ? 'hover:bg-vintage-accent/10 text-vintage-dark' : 'hover:bg-slate-100 text-slate-600'}`}
                aria-label="Toggle Theme"
              >
                {theme === 'vintage' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button onClick={toggleTheme} className="p-2">
                {theme === 'vintage' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden p-4 space-y-2 border-t ${theme === 'vintage' ? 'border-vintage-accent/20 bg-vintage-paper' : 'border-slate-100 bg-white'}`}>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2">主页</Link>
            <Link to="/gallery" onClick={() => setIsMobileMenuOpen(false)} className="block py-2">画廊</Link>
            <Link to="/photowall" onClick={() => setIsMobileMenuOpen(false)} className="block py-2">照片墙</Link>
            <Link to="/admin/login" onClick={() => setIsMobileMenuOpen(false)} className="block py-2">Login</Link>
          </div>
        )}
      </nav>

      <main>
        {children}
      </main>

      <footer className={`py-12 ${theme === 'vintage' ? 'bg-vintage-dark text-vintage-paper border-t-4 border-vintage-accent' : 'bg-slate-50 text-slate-500 border-t border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            {theme === 'vintage' && <BookOpen className="w-5 h-5" />}
            <span className="font-bold">{logoText}</span>
          </div>
          <p className="text-sm opacity-80">© 2026 {logoText}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const AdminLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/');
  };

  const sidebarItems = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: BookOpen, label: 'My Books', path: '/admin/dashboard' }, // Redundant for demo but keeps menu full
    { icon: Briefcase, label: 'Add New', path: '/admin/book/new' },
    { icon: User, label: 'Profile Settings', path: '/admin/profile' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
          <span className="font-bold text-lg">Artist Admin</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors">
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto h-screen">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-8 justify-between sticky top-0 z-10">
          <h1 className="font-semibold text-lg">
            {location.pathname.includes('profile') ? 'Profile & Settings' :
              location.pathname.includes('new') ? 'Create Book' : 'Dashboard'}
          </h1>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-slate-500 hover:text-blue-600">View Site</Link>
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
              <img src="https://picsum.photos/seed/user1/200/200" alt="Avatar" />
            </div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
