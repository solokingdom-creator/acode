
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../src/contexts/ThemeContext';
import { api } from '../src/lib/api';
import { Book } from '../types';
import { ArrowLeft, Share2, Heart, X, ChevronLeft, ChevronRight, Maximize2, Loader2 } from 'lucide-react';

export const DetailPage: React.FC = () => {
   const { id } = useParams<{ id: string }>();
   const { theme } = useTheme();
   const navigate = useNavigate();
   const [book, setBook] = useState<Book | null>(null);
   const [loading, setLoading] = useState(true);
   const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

   useEffect(() => {
      const fetchBook = async () => {
         if (!id) return;
         try {
            const data = await api.getBook(id);
            setBook(data);
         } catch (error) {
            console.error('Failed to fetch book:', error);
         } finally {
            setLoading(false);
         }
      };
      fetchBook();
   }, [id]);

   if (loading) {
      return (
         <div className="flex justify-center items-center min-h-[50vh]">
            <Loader2 className={`w-8 h-8 animate-spin ${theme === 'vintage' ? 'text-vintage-accent' : 'text-slate-400'}`} />
         </div>
      );
   }

   if (!book) return <div className="p-20 text-center">Book not found</div>;

   const allImages = [book.coverUrl || book.cover_url, ...(book.pages || [])];
   const isLightboxOpen = lightboxIndex >= 0;

   // Keyboard navigation for lightbox
   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (!isLightboxOpen) return;
         if (e.key === 'Escape') setLightboxIndex(-1);
         if (e.key === 'ArrowLeft') setLightboxIndex(prev => Math.max(0, prev - 1));
         if (e.key === 'ArrowRight') setLightboxIndex(prev => Math.min(allImages.length - 1, prev + 1));
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, [isLightboxOpen, allImages.length]);

   return (
      <div className={`min-h-screen ${theme === 'vintage' ? 'bg-vintage-bg text-vintage-text' : 'bg-white text-slate-900'}`}>

         {/* Lightbox Overlay */}
         {isLightboxOpen && (
            <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center animate-in fade-in duration-200">
               {/* Close Button */}
               <button
                  onClick={() => setLightboxIndex(-1)}
                  className="absolute top-6 right-6 text-white/70 hover:text-white p-2 z-10"
               >
                  <X size={32} />
               </button>

               {/* Image Counter */}
               <div className="absolute top-6 left-6 text-white/70 font-mono text-sm z-10 select-none">
                  {lightboxIndex === 0 ? "Cover" : `Page ${lightboxIndex} / ${allImages.length - 1}`}
               </div>

               {/* Main Image Container */}
               <div className="w-full h-full p-4 md:p-12 flex items-center justify-center relative group">
                  {/* Prev Button */}
                  {lightboxIndex > 0 && (
                     <button
                        onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => prev - 1); }}
                        className="absolute left-4 md:left-8 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all p-3"
                     >
                        <ChevronLeft size={48} />
                     </button>
                  )}

                  <img
                     src={allImages[lightboxIndex]}
                     alt="Fullscreen view"
                     className="max-w-full max-h-full object-contain shadow-2xl"
                  />

                  {/* Next Button */}
                  {lightboxIndex < allImages.length - 1 && (
                     <button
                        onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => prev + 1); }}
                        className="absolute right-4 md:right-8 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all p-3"
                     >
                        <ChevronRight size={48} />
                     </button>
                  )}
               </div>

               {/* Bottom Strip Thumbnails */}
               <div className="h-20 w-full overflow-x-auto whitespace-nowrap px-4 pb-6 flex items-center justify-center gap-2 no-scrollbar z-10">
                  {allImages.map((img, idx) => (
                     <button
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx); }}
                        className={`h-12 w-12 rounded-md overflow-hidden transition-all flex-shrink-0 border-2 ${lightboxIndex === idx ? 'border-white scale-110 opacity-100' : 'border-transparent opacity-40 hover:opacity-100'}`}
                     >
                        <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                     </button>
                  ))}
               </div>
            </div>
         )}

         {/* Navigation Bar for Detail */}
         <div className={`sticky top-20 z-40 px-6 py-4 flex justify-between items-center backdrop-blur-md transition-colors duration-300 ${theme === 'vintage' ? 'bg-vintage-paper/80 border-b border-vintage-accent/20' : 'bg-white/80 border-b border-slate-100'}`}>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
               <ArrowLeft size={20} />
               <span className="font-medium text-sm">Back</span>
            </button>
            <div className="flex gap-4">
               <button className="hover:opacity-70"><Share2 size={20} /></button>
               <button className="hover:opacity-70"><Heart size={20} /></button>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

               {/* Left Column: Images (wider) */}
               <div className="lg:col-span-7 space-y-8">
                  {/* Main Cover View */}
                  <div
                     className={`relative aspect-[4/3] w-full overflow-hidden group cursor-zoom-in ${theme === 'vintage' ? 'bg-white p-4 shadow-xl border border-vintage-paper' : 'rounded-2xl shadow-lg'}`}
                     onClick={() => setLightboxIndex(0)}
                  >
                     <img src={book.coverUrl || book.cover_url} alt={book.title} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${theme === 'vintage' ? 'sepia-[.15]' : ''}`} />
                     <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                        <Maximize2 size={20} />
                     </div>
                     <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm font-medium">
                        Cover
                     </div>
                  </div>

                  {/* Pages Grid */}
                  {book.pages && book.pages.length > 0 && (
                     <div className="space-y-4">
                        <h3 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${theme === 'vintage' ? 'text-vintage-accent' : 'text-slate-400'}`}>
                           Inside the Book <span className="px-2 py-0.5 bg-slate-100 rounded-full text-[10px] text-slate-600">{book.pages.length} Pages</span>
                        </h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                           {book.pages.map((page, idx) => (
                              <div
                                 key={idx}
                                 className={`relative aspect-square overflow-hidden cursor-pointer group transition-all duration-300 ${theme === 'vintage'
                                    ? 'bg-white p-1 border border-vintage-paper shadow-sm hover:shadow-md'
                                    : 'bg-slate-50 rounded-lg hover:shadow-md'
                                    }`}
                                 onClick={() => setLightboxIndex(idx + 1)} // +1 because 0 is cover
                              >
                                 <img src={page} alt={`Page ${idx + 1}`} className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${theme === 'vintage' ? 'sepia-[.1]' : ''}`} />
                                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                 <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm font-mono opacity-80 group-hover:opacity-100">
                                    {idx + 1}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {!book.pages?.length && (
                     <div className="p-8 text-center bg-slate-50 rounded-lg text-slate-400 italic text-sm border border-dashed border-slate-200">
                        No additional pages available for this preview.
                     </div>
                  )}
               </div>

               {/* Right Column: Info (narrower) */}
               <div className="lg:col-span-5 flex flex-col lg:sticky lg:top-40 h-fit">
                  <div className={`mb-4 text-xs font-bold uppercase tracking-widest ${theme === 'vintage' ? 'text-vintage-accent' : 'text-blue-600'}`}>
                     {book.category} — {book.year}
                  </div>

                  <h1 className={`text-4xl lg:text-5xl mb-6 leading-tight ${theme === 'vintage' ? 'font-serif font-bold text-vintage-dark' : 'font-extrabold tracking-tight text-slate-900'}`}>
                     {book.title}
                  </h1>

                  <div className="flex items-center gap-4 mb-8">
                     <div className={`h-px w-12 ${theme === 'vintage' ? 'bg-vintage-accent/50' : 'bg-slate-300'}`}></div>
                     <span className={`text-lg italic ${theme === 'vintage' ? 'font-serif text-vintage-text' : 'font-medium text-slate-500'}`}>
                        by {book.author}
                     </span>
                  </div>

                  <div className={`prose prose-lg mb-10 leading-relaxed ${theme === 'vintage' ? 'font-serif text-vintage-text/80' : 'text-slate-600'}`}>
                     <p>{book.description}</p>
                     <p className="text-base opacity-80">This work represents a specific period of artistic exploration. The composition and texture choices reflect a dialogue between traditional mediums and modern sensibilities.</p>
                  </div>

                  {/* Read/Purchase Buttons */}
                  <div className="space-y-3 mt-auto">
                     {book.pages && book.pages.length > 0 && (
                        <button
                           onClick={() => setLightboxIndex(0)}
                           className={`w-full py-3.5 text-center text-sm font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${theme === 'vintage'
                              ? 'border border-vintage-dark text-vintage-dark hover:bg-vintage-dark hover:text-vintage-paper'
                              : 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-xl hover:border-slate-300'
                              }`}
                        >
                           <Maximize2 size={16} /> Open Gallery View
                        </button>
                     )}

                     <button className={`w-full py-4 text-center text-sm font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-xl ${theme === 'vintage'
                        ? 'bg-vintage-dark text-vintage-paper hover:bg-vintage-accent'
                        : 'bg-slate-900 text-white hover:bg-slate-800 rounded-xl'
                        }`}>
                        Purchase Print
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};
