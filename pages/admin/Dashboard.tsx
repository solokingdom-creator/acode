
import React, { useState, useEffect } from 'react';
import { api } from '../../src/lib/api';
import { Book } from '../../types';
import { Search, Filter, Plus, Edit2, Trash2, BookOpen, Image as ImageIcon, AlertTriangle, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
   const navigate = useNavigate();
   const [books, setBooks] = useState<Book[]>([]);
   const [search, setSearch] = useState('');
   const [activeTab, setActiveTab] = useState<'book' | 'photo'>('book');
   const [loading, setLoading] = useState(true);

   // Delete Modal State
   const [deleteId, setDeleteId] = useState<string | null>(null);

   // Fetch books
   useEffect(() => {
      const fetchBooks = async () => {
         try {
            const data = await api.getBooks({ type: activeTab });
            setBooks(data);
         } catch (error) {
            console.error('Failed to fetch books:', error);
         } finally {
            setLoading(false);
         }
      };
      fetchBooks();
   }, [activeTab]);

   // Filter by search
   const filtered = books.filter(b =>
      b.title.toLowerCase().includes(search.toLowerCase())
   );

   const handleEdit = (item: Book) => {
      navigate(`/admin/book/new?type=${item.type}&id=${item.id}`);
   };

   const handleDeleteClick = (id: string) => {
      setDeleteId(id);
   };

   const confirmDelete = async () => {
      if (deleteId) {
         try {
            await api.deleteBook(deleteId);
            setBooks(prev => prev.filter(b => b.id !== deleteId));
            setDeleteId(null);
         } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete item');
         }
      }
   };

   return (
      <div className="space-y-6 relative">

         {/* Type Tabs */}
         <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit">
            <button
               onClick={() => setActiveTab('book')}
               className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'book' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
            >
               <BookOpen size={16} />
               Storybooks
            </button>
            <button
               onClick={() => setActiveTab('photo')}
               className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'photo' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
            >
               <ImageIcon size={16} />
               Photo Wall
            </button>
         </div>

         {/* Actions Bar */}
         <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-md">
               <Search className="absolute left-3 top-3 text-slate-400" size={20} />
               <input
                  type="text"
                  placeholder={`Search ${activeTab === 'book' ? 'books' : 'photos'}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
               />
            </div>
            <div className="flex gap-2">
               <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                  <Filter size={18} />
                  Filter
               </button>
               <Link to={`/admin/book/new?type=${activeTab}`} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm font-medium">
                  <Plus size={18} />
                  Add {activeTab === 'book' ? 'Book' : 'Photo'}
               </Link>
            </div>
         </div>

         {/* Table */}
         <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
               <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                  <tr>
                     <th className="px-6 py-4">{activeTab === 'book' ? 'Cover' : 'Photo'}</th>
                     <th className="px-6 py-4">Title</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4">Category</th>
                     {activeTab === 'book' && <th className="px-6 py-4">Author</th>}
                     <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {filtered.map((item) => (
                     <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <div className={`bg-slate-200 rounded overflow-hidden ${activeTab === 'book' ? 'w-10 h-14' : 'w-16 h-12'}`}>
                              <img src={item.coverUrl || item.cover_url} alt="" className="w-full h-full object-cover" />
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="font-medium text-slate-900">{item.title}</div>
                           <div className="text-xs text-slate-500 truncate max-w-[200px]">{item.description}</div>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.status === 'published'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                              }`}>
                              {item.status.toUpperCase()}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 italic">
                           {item.category}
                        </td>
                        {activeTab === 'book' && (
                           <td className="px-6 py-4 text-sm text-slate-500">
                              {item.author}
                           </td>
                        )}
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <button
                                 onClick={() => handleEdit(item)}
                                 className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              >
                                 <Edit2 size={16} />
                              </button>
                              <button
                                 onClick={() => handleDeleteClick(item.id)}
                                 className="p-2 text-red-600 hover:bg-red-50 rounded"
                              >
                                 <Trash2 size={16} />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
            {filtered.length === 0 && (
               <div className="p-12 text-center text-slate-500">
                  No {activeTab}s found matching your search.
               </div>
            )}
         </div>

         {/* Delete Confirmation Modal */}
         {deleteId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
               <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4 mx-auto">
                     <AlertTriangle size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Delete Content?</h3>
                  <p className="text-slate-500 text-center text-sm mb-6">
                     Are you sure you want to delete this item? This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                     <button
                        onClick={() => setDeleteId(null)}
                        className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                     >
                        Cancel
                     </button>
                     <button
                        onClick={confirmDelete}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                     >
                        Delete
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};
