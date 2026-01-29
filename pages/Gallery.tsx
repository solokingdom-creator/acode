
import React, { useState, useEffect } from 'react';
import { useTheme } from '../src/contexts/ThemeContext';
import { CATEGORIES } from '../constants';
import { api } from '../src/lib/api';
import { Book } from '../types';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export const Gallery: React.FC = () => {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState("All");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await api.getBooks({ type: 'book', status: 'published' });
        setBooks(data);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = activeCategory === "All"
    ? books
    : books.filter(b => b.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className={`text-4xl md:text-5xl mb-6 ${theme === 'vintage' ? 'font-serif text-vintage-dark' : 'font-bold text-slate-900'}`}>
          画廊
        </h1>
        <p className={`max-w-2xl mx-auto ${theme === 'vintage' ? 'font-body italic' : 'text-slate-500'}`}>
          风格各异的绘本 搭乘画页驶向深空
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        {CATEGORIES.slice(0, 6).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`transition-all duration-300 ${theme === 'vintage'
              ? `px-6 py-2 font-serif text-sm tracking-widest uppercase border border-vintage-accent/20 ${activeCategory === cat ? 'bg-vintage-accent text-white shadow-md' : 'bg-transparent text-vintage-text hover:bg-vintage-paper'}`
              : `px-6 py-2 rounded-full text-sm font-medium ${activeCategory === cat ? 'bg-nordic-accent text-white shadow-lg shadow-sky-500/30' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className={`w-8 h-8 animate-spin ${theme === 'vintage' ? 'text-vintage-accent' : 'text-slate-400'}`} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {filteredBooks.map((book) => (
            <Link to={`/book/${book.id}`} key={book.id} className="group flex flex-col items-center">
              <div className={`relative w-full aspect-[3/4] mb-6 overflow-hidden ${theme === 'vintage'
                ? 'bg-white p-2 shadow-xl border border-vintage-paper transform transition-transform group-hover:scale-[1.02]'
                : 'rounded-[2rem] shadow-sm bg-slate-50 group-hover:shadow-xl transition-all duration-300'
                }`}>
                <div className={`w-full h-full overflow-hidden ${theme === 'vintage' ? '' : 'rounded-[1.5rem]'}`}>
                  <img src={book.coverUrl || book.cover_url} alt={book.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
              </div>

              <div className="text-center">
                <h3 className={`text-lg mb-2 ${theme === 'vintage' ? 'font-serif text-vintage-dark font-bold' : 'font-bold text-slate-900'}`}>
                  {book.title}
                </h3>
                <div className={`text-xs uppercase tracking-wider ${theme === 'vintage' ? 'text-vintage-accent font-serif' : 'text-nordic-accent font-bold'}`}>
                  {book.category} <span className="text-gray-300 mx-1">•</span> {book.year}
                </div>
              </div>
            </Link>
          ))}
          {filteredBooks.length === 0 && (
            <div className="col-span-full text-center py-12 opacity-50">
              No books found in this category.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
