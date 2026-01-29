
import React, { useState, useEffect } from 'react';
import { useTheme } from '../src/contexts/ThemeContext';
import { api } from '../src/lib/api';
import { Book } from '../types';
import { Loader2 } from 'lucide-react';

const PhotoItem: React.FC<{ photo: Book }> = ({ photo }) => {
  const { theme } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={`break-inside-avoid relative group overflow-hidden ${theme === 'vintage'
        ? 'bg-white p-3 shadow-lg border border-vintage-paper'
        : 'rounded-2xl shadow-sm hover:shadow-xl transition-shadow bg-slate-100'
        }`}
    >
      <img
        src={photo.coverUrl || photo.cover_url}
        alt={photo.title}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-auto object-cover transition-all duration-700 group-hover:scale-105 ${theme === 'vintage' ? 'sepia-[.15] group-hover:sepia-0' : 'rounded-xl'
          } ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Overlay Info */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 ${theme === 'vintage' ? '' : 'rounded-2xl'}`}>
        <span className="text-white font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          {photo.title}
        </span>
        <div className="flex justify-between items-end mt-1">
          <span className="text-white/80 text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
            {photo.description}
          </span>
          <span className="text-white/60 text-xs translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100 uppercase tracking-wider">
            {photo.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export const PhotoWall: React.FC = () => {
  const { theme } = useTheme();
  const [photos, setPhotos] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const data = await api.getBooks({ type: 'photo', status: 'published' });
        setPhotos(data);
      } catch (error) {
        console.error('Failed to fetch photos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className={`text-4xl md:text-5xl mb-6 ${theme === 'vintage' ? 'font-serif text-vintage-dark' : 'font-bold text-slate-900'}`}>
          照片墙
        </h1>
        <p className={`max-w-2xl mx-auto ${theme === 'vintage' ? 'font-body italic' : 'text-slate-500'}`}>
          生活碎片的集合，记录每一个值得铭记的瞬间。
        </p>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <Loader2 className={`animate-spin ${theme === 'vintage' ? 'text-vintage-accent' : 'text-slate-400'}`} />
          </div>
        ) : photos.map((photo) => (
          <PhotoItem key={photo.id} photo={photo} />
        ))}
        {!loading && photos.length === 0 && (
          <div className={`col-span-full text-center py-20 ${theme === 'vintage' ? 'font-serif text-vintage-text/60' : 'text-slate-400'}`}>
            目前还没有上传照片。
          </div>
        )}
      </div>
    </div>
  );
};
