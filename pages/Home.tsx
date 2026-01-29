
import React, { useState, useEffect } from 'react';
import { useTheme } from '../src/contexts/ThemeContext';
import { api } from '../src/lib/api';
import { Book } from '../types';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';

export const Home: React.FC = () => {
  const { theme } = useTheme();
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Use the first book as the featured hero book for the link
  const heroBookId = featuredBooks[0]?.id || "1";

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const books = await api.getBooks({ status: 'published' });
        setFeaturedBooks(books.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch books:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Meteor Effect State
  const [meteors, setMeteors] = useState<{ id: number, x: number, y: number }[]>([]);

  const handleMeteorClick = (e: React.MouseEvent) => {
    const id = Date.now() + Math.random();
    // Using clientX/Y for fixed positioning
    setMeteors(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);

    // Cleanup after animation duration
    setTimeout(() => {
      setMeteors(prev => prev.filter(m => m.id !== id));
    }, 800);
  };

  return (
    <div className="pb-20 cursor-pointer" onClick={handleMeteorClick}>
      {/* Styles for Meteor Animation */}
      <style>{`
        @keyframes meteor {
          0% { transform: rotate(45deg) translateX(0); opacity: 1; }
          100% { transform: rotate(45deg) translateX(400px); opacity: 0; }
        }
        .animate-meteor {
          animation: meteor 0.7s ease-out forwards;
        }
      `}</style>

      {/* Render Meteors */}
      {meteors.map(m => (
        <div
          key={m.id}
          className="fixed z-[100] pointer-events-none"
          style={{ left: m.x, top: m.y }}
        >
          <div className="animate-meteor origin-left -mt-0.5 -ml-0.5">
            <div className={`h-[3px] w-[150px] rounded-full bg-gradient-to-r from-transparent to-transparent ${theme === 'vintage'
                ? 'via-vintage-accent shadow-[0_0_10px_rgba(180,83,9,0.5)]'
                : 'via-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]'
              }`} />
          </div>
        </div>
      ))}

      {/* Hero Section */}
      <section className={`relative min-h-[85vh] flex items-center pt-10 pb-20 ${theme === 'vintage' ? 'border-b border-vintage-accent/10' : ''}`}>
        {/* Changed items-center to lg:items-stretch to make columns equal height for top/bottom alignment */}
        <div className="max-w-6xl mx-auto w-full px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center lg:items-stretch">

          {/* Left Content */}
          {/* Changed layout to flex-col with justify-between to anchor top and bottom elements */}
          <div className="z-10 order-2 lg:order-1 flex flex-col lg:justify-between items-start space-y-6 lg:space-y-0 py-1">

            {/* Top Anchor: Date/Label */}
            <div className={`text-xs font-bold tracking-[0.2em] uppercase ${theme === 'vintage' ? 'text-vintage-accent' : 'text-slate-400'}`}>
              2026 特刊
            </div>

            {/* Middle Content: Title & Description (Centered in remaining space) */}
            <div className="flex-1 flex flex-col justify-center space-y-6">
              <h1 className={`text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tighter ${theme === 'vintage' ? 'font-serif text-vintage-dark' : 'font-sans font-extrabold text-slate-900'}`}>
                视觉创造<br />
                <span className={theme === 'vintage' ? 'italic text-vintage-accent' : 'text-slate-400'}>雪地</span>
              </h1>

              <p className={`text-lg leading-relaxed max-w-md ${theme === 'vintage' ? 'font-body text-vintage-text/80' : 'text-slate-500 font-light'}`}>
                {theme === 'vintage'
                  ? "A curated collection of illustrated journeys. We preserve the warmth of classic storytelling for the modern reader."
                  : "Ivan作品辑录"}
              </p>
            </div>

            {/* Bottom Anchor: Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto relative z-20">
              <Link to="/gallery" className={`px-8 py-3.5 text-center transition-all ${theme === 'vintage'
                  ? 'bg-vintage-dark text-vintage-paper font-serif hover:bg-vintage-accent shadow-lg uppercase tracking-widest text-xs'
                  : 'bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 shadow-xl shadow-slate-900/10'
                }`}>
                走进画廊
              </Link>
              <Link to="/photowall" className={`px-8 py-3.5 text-center transition-all ${theme === 'vintage'
                  ? 'border border-vintage-dark text-vintage-dark font-serif hover:bg-vintage-accent/5 uppercase tracking-widest text-xs'
                  : 'bg-white text-slate-900 border border-slate-200 font-bold text-sm hover:bg-slate-50'
                }`}>
                浏览照片墙
              </Link>
            </div>
          </div>

          {/* Right Hero Image */}
          {/* Removed items-center to allow full height stretch if needed, though mostly determined by image aspect ratio */}
          <div className="w-full relative order-1 lg:order-2 flex justify-center lg:justify-end">

            {/* Frame/Matte Container - Clickable Link */}
            <Link to={`/book/${heroBookId}`} className={`block w-full lg:w-full p-3 transition-all duration-500 group cursor-pointer relative z-10 ${theme === 'vintage'
                ? 'bg-[#fdfbf7] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] border border-[#eaddcf] rotate-1 hover:rotate-0 hover:scale-[1.02]'
                : 'bg-slate-50 rounded-[2rem] hover:shadow-lg hover:-translate-y-1'
              }`}>
              {/* Inner Image */}
              <div className={`w-full aspect-[4/3] overflow-hidden relative ${theme === 'vintage' ? 'border-4 border-white shadow-sm sepia-[.15] group-hover:sepia-0 transition-all duration-500' : 'rounded-xl shadow-sm'}`}>
                <img
                  src="https://picsum.photos/seed/visualstories/1200/900"
                  alt="Hero Illustration"
                  className="w-full h-full object-cover"
                />
                {/* Minimalist Overlay Gradient */}
                {theme === 'nordic' && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/20 to-transparent pointer-events-none"></div>
                )}
              </div>

              {/* Image Metadata/Caption */}
              <div className={`flex justify-between items-end mt-4 pt-3 px-2 ${theme === 'vintage' ? 'border-t border-vintage-accent/10' : ''}`}>
                <div>
                  <span className={`block mb-1 text-[10px] uppercase tracking-wider ${theme === 'vintage' ? 'text-vintage-text/50' : 'text-slate-400'}`}>瞬间</span>
                  <span className={`text-sm font-bold ${theme === 'vintage' ? 'font-serif text-vintage-dark' : 'text-slate-900'}`}>追星者</span>
                </div>
                <div className={`text-xs ${theme === 'vintage' ? 'font-serif italic' : 'font-mono text-slate-400'}`}>
                  01 / 2026
                </div>
              </div>
            </Link>

            {/* Decorative Blob for Nordic */}
            {theme === 'nordic' && (
              <div className="absolute -top-10 -right-10 -z-10 w-[400px] h-[400px] bg-indigo-50/80 rounded-full blur-3xl opacity-60"></div>
            )}
          </div>
        </div>
      </section>

      {/* Selected Works Header */}
      <section className="max-w-6xl mx-auto px-6 lg:px-12 mt-10 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-gray-200">
          <h2 className={`text-4xl ${theme === 'vintage' ? 'font-serif text-vintage-dark' : 'font-bold text-slate-900 uppercase tracking-tight'}`}>
            精选特辑
          </h2>
          <p className={`max-w-md text-right md:text-left ${theme === 'vintage' ? 'font-body italic text-vintage-text/60' : 'text-slate-500 text-sm'}`}>
            讲述故事/记录瞬间
          </p>
        </div>
      </section>

      {/* Works Grid */}
      <section className="max-w-6xl mx-auto px-6 lg:px-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className={`w-8 h-8 animate-spin ${theme === 'vintage' ? 'text-vintage-accent' : 'text-slate-400'}`} />
          </div>
        ) : featuredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuredBooks.map((book) => (
              <Link to={`/book/${book.id}`} key={book.id} className="group block relative z-10">
                <div className={`relative aspect-[3/4] overflow-hidden mb-5 ${theme === 'vintage'
                    ? 'bg-white p-3 shadow-lg rotate-0 group-hover:-rotate-1 transition-transform duration-500'
                    : 'bg-slate-100 transition-all duration-500 group-hover:shadow-xl'
                  }`}>
                  <img src={book.coverUrl || book.cover_url} alt={book.title} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${theme === 'vintage' ? 'sepia-[.15] group-hover:sepia-0' : ''}`} />
                </div>

                <div className="flex justify-between items-baseline border-b border-gray-100 pb-2">
                  <h3 className={`text-lg ${theme === 'vintage' ? 'font-serif text-vintage-dark font-bold' : 'font-bold text-slate-900 uppercase tracking-wide'}`}>
                    {book.title}
                  </h3>
                  <span className="text-[10px] uppercase tracking-widest text-gray-400">{book.type || 'Book'}</span>
                </div>

                <div className="flex justify-between mt-2">
                  <p className={`text-xs uppercase tracking-wider ${theme === 'vintage' ? 'text-vintage-accent' : 'text-slate-400'}`}>
                    创作时段
                  </p>
                  <p className="text-xs text-gray-400">{book.year}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={`text-center py-20 ${theme === 'vintage' ? 'font-serif text-vintage-text/60' : 'text-slate-400'}`}>
            空空如也，请期待更多作品。
          </div>
        )}

        <div className="mt-16 flex justify-center relative z-10">
          <Link to="/gallery" className={`flex items-center gap-3 text-sm uppercase tracking-widest font-bold transition-all ${theme === 'vintage' ? 'text-vintage-dark hover:text-vintage-accent' : 'text-slate-900 hover:text-slate-600'
            }`}>
            看看其他的 <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
};
