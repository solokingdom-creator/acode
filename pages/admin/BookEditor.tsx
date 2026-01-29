
import React, { useState, useEffect, useRef } from 'react';
import { Image, Save, ArrowLeft, Upload, Plus, BookOpen, ImageIcon, X, Trash2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../src/lib/api';

export const BookEditor: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    // Modes
    const editId = searchParams.get('id');
    const isEditing = !!editId;

    // Default to book if not specified
    const [contentType, setContentType] = useState<'book' | 'photo'>('book');

    // Form State
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [category, setCategory] = useState('Nature');
    const [description, setDescription] = useState('');
    const [coverUrl, setCoverUrl] = useState('');
    const [status, setStatus] = useState<'published' | 'draft'>('draft');

    // State for book pages
    const [pages, setPages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);

    // Initialize Data for Editing
    useEffect(() => {
        const typeParam = searchParams.get('type');
        if (typeParam === 'photo' || typeParam === 'book') {
            setContentType(typeParam);
        }

        // If Editing, fetch data
        if (editId) {
            const fetchBook = async () => {
                try {
                    const book = await api.getBook(editId);
                    setTitle(book.title);
                    setCategory(book.category);
                    setDescription(book.description);
                    setCoverUrl(book.cover_url);
                    setStatus(book.status);
                    if (book.year) setYear(book.year);
                    if (book.author) setAuthor(book.author);
                    if (book.pages) setPages(book.pages);
                    setContentType(book.type);
                } catch (error) {
                    console.error('Failed to fetch book:', error);
                    alert('Failed to load book data');
                }
            };
            fetchBook();
        }
    }, [searchParams, editId]);

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadingCover(true);
            try {
                const { url } = await api.uploadFile(e.target.files[0]);
                setCoverUrl(url);
            } catch (error) {
                console.error('Upload failed:', error);
                alert('Failed to upload cover image');
            } finally {
                setUploadingCover(false);
            }
        }
    };

    const handlePageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            try {
                const uploadPromises = Array.from(e.target.files).map(file => api.uploadFile(file));
                const results = await Promise.all(uploadPromises);
                const urls = results.map(r => r.url);
                setPages(prev => [...prev, ...urls]);
            } catch (error) {
                console.error('Upload failed:', error);
                alert('Failed to upload pages');
            }
        }
    };

    const removePage = (index: number) => {
        setPages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async (publishStatus: 'published' | 'draft') => {
        if (!title || !category || !coverUrl) {
            alert('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const data = {
                type: contentType,
                title,
                author,
                year,
                category,
                cover_url: coverUrl,
                description,
                status: publishStatus,
                pages: contentType === 'book' ? pages : []
            };

            if (isEditing) {
                await api.updateBook(editId, data);
            } else {
                await api.createBook(data);
            }

            navigate('/admin/dashboard');
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800">
                    <ArrowLeft size={18} /> Back to Dashboard
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleSave('draft')}
                        disabled={loading}
                        className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 font-medium disabled:opacity-50"
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={() => handleSave('published')}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save size={18} /> {loading ? 'Saving...' : (isEditing ? 'Update' : 'Publish')}
                    </button>
                </div>
            </div>

            {/* Content Type Toggle */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">{isEditing ? 'Edit Content' : 'Create New Content'}</h2>
                    <p className="text-sm text-slate-500">
                        {isEditing ? `Editing ${contentType === 'book' ? 'Storybook' : 'Photo'} details.` : 'Select the type of content you want to upload.'}
                    </p>
                </div>
                {!isEditing && (
                    <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setContentType('book')}
                            className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all ${contentType === 'book' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <BookOpen size={16} />
                            Storybook
                        </button>
                        <button
                            onClick={() => setContentType('photo')}
                            className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all ${contentType === 'photo' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <ImageIcon size={16} />
                            Photo Wall
                        </button>
                    </div>
                )}
            </div>

            {/* Main Form Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
                <h2 className="text-lg font-semibold border-l-4 border-blue-600 pl-3">
                    {contentType === 'book' ? 'Story Details' : 'Photo Details'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            {contentType === 'book' ? 'Book Title' : 'Photo Title'}
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                            placeholder={contentType === 'book' ? "e.g. The Silent Forest" : "e.g. Morning Coffee"}
                        />
                    </div>

                    {contentType === 'book' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
                                <input
                                    type="text"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                    placeholder="Artist Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                                <input
                                    type="number"
                                    value={year}
                                    onChange={(e) => setYear(parseInt(e.target.value))}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        >
                            <option>Nature</option>
                            <option>Fantasy</option>
                            <option>Folklore</option>
                            <option>History</option>
                            <option>Life</option>
                            <option>Travel</option>
                            <option>Work</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description / Caption</label>
                    <textarea
                        rows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        placeholder={contentType === 'book' ? "Synopsis of the story..." : "Caption for the photo..."}
                    />
                </div>
            </div>

            {/* Upload Section */}
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
                <h2 className="text-lg font-semibold border-l-4 border-blue-600 pl-3">
                    {contentType === 'book' ? 'Cover Upload' : 'Photo Upload'}
                </h2>

                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer group"
                    onClick={() => coverInputRef.current?.click()}>
                    {uploadingCover ? (
                        <div className="text-blue-600">Uploading...</div>
                    ) : coverUrl ? (
                        <div className="relative w-48 h-64 shadow-lg rounded-lg overflow-hidden mb-4">
                            <img src={coverUrl} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-sm font-medium">Change Image</span>
                            </div>
                        </div>
                    ) : (
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-600">
                            <Image size={32} />
                        </div>
                    )}

                    <h3 className="font-medium text-slate-900">
                        {contentType === 'book' ? 'Upload book cover' : 'Upload photo'}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">High resolution JPG or PNG recommended</p>
                    {!uploadingCover && (
                        <button type="button" className="mt-6 px-6 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50">
                            Select File
                        </button>
                    )}
                    <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverUpload}
                    />
                </div>
            </div>

            {/* Pages Grid - ONLY FOR BOOKS */}
            {contentType === 'book' && (
                <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold border-l-4 border-blue-600 pl-3">Story Pages</h2>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handlePageUpload}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1"
                        >
                            <Upload size={14} /> Add Multiple
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Add Button */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center flex-col text-slate-400 cursor-pointer hover:bg-slate-100 hover:border-blue-400 hover:text-blue-500 transition-all"
                        >
                            <Plus size={32} />
                            <span className="text-xs font-semibold mt-2">ADD PAGE</span>
                        </div>

                        {/* Page Items */}
                        {pages.map((page, idx) => (
                            <div key={idx} className="aspect-square relative rounded-lg overflow-hidden group border border-slate-200 shadow-sm">
                                <img src={page} className="w-full h-full object-cover" alt={`Page ${idx + 1}`} />

                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removePage(idx); }}
                                        className="bg-white text-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all hover:bg-red-50 shadow-lg"
                                        title="Remove page"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded opacity-100 group-hover:opacity-0 transition-opacity">
                                    {idx + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
