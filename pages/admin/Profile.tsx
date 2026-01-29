import React, { useState, useEffect } from 'react';
import { api } from '../../src/lib/api';
import { User } from '../../types';
import { useAuth } from '../../src/contexts/AuthContext';
import { Save, User as UserIcon, Mail, Globe, Twitter, Instagram } from 'lucide-react';

export const Profile: React.FC = () => {
   const { user: authUser, refreshUser } = useAuth();
   const [name, setName] = useState('');
   const [bio, setBio] = useState('');
   const [avatarUrl, setAvatarUrl] = useState('');
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const [success, setSuccess] = useState(false);

   useEffect(() => {
      if (authUser) {
         setName(authUser.name || '');
         setBio(authUser.bio || '');
         setAvatarUrl(authUser.avatarUrl || '');
      }
   }, [authUser]);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setSuccess(false);
      setLoading(true);

      try {
         await api.updateUserProfile({ name, bio, avatar_url: avatarUrl });
         await refreshUser();
         setSuccess(true);
         setTimeout(() => setSuccess(false), 3000);
      } catch (err: any) {
         setError(err.message || 'Update failed');
      } finally {
         setLoading(false);
      }
   };

   const handleAvatarUpload = async (file: File) => {
      try {
         const { url } = await api.uploadFile(file);
         setAvatarUrl(url);
      } catch (error) {
         console.error('Upload failed:', error);
         alert('Failed to upload avatar');
      }
   };

   return (
      <div className="max-w-3xl mx-auto space-y-8">
         {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
               {error}
            </div>
         )}
         {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
               Profile updated successfully!
            </div>
         )}

         {/* Avatar Card */}
         <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg shrink-0">
               {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                     <UserIcon size={48} className="text-slate-400" />
                  </div>
               )}
            </div>
            <div className="flex-1 space-y-4 text-center md:text-left">
               <div>
                  <h2 className="text-xl font-bold text-slate-900">Profile Photo</h2>
                  <p className="text-sm text-slate-500 mt-1">Upload a high-resolution headshot. PNG or JPG, max 5MB.</p>
               </div>
               <div className="flex gap-3 justify-center md:justify-start">
                  <label className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 cursor-pointer">
                     Change Photo
                     <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
                     />
                  </label>
                  {avatarUrl && (
                     <button
                        onClick={() => setAvatarUrl('')}
                        className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-50"
                     >
                        Remove
                     </button>
                  )}
               </div>
            </div>
         </div>

         {/* Form */}
         <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-8">
            <div>
               <h2 className="text-lg font-bold text-slate-900 mb-6">About Me</h2>
               <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                     <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Biography</label>
                     <textarea
                        rows={6}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-700 leading-relaxed"
                     />
                     <div className="text-right text-xs text-slate-400 mt-2">{bio.length} / 1500 characters</div>
                  </div>
               </div>
            </div>

            <div className="border-t border-slate-100 pt-8">
               <h2 className="text-lg font-bold text-slate-900 mb-6">Contact Information</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Professional Email</label>
                     <div className="relative">
                        <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <input
                           type="email"
                           value={authUser?.email || ''}
                           disabled
                           className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500"
                        />
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex justify-end pt-4">
               <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md flex items-center gap-2 disabled:opacity-50"
               >
                  <Save size={18} /> {loading ? 'Saving...' : 'Save All Changes'}
               </button>
            </div>
         </form>
      </div>
   );
};