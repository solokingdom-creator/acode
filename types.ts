
export type ThemeMode = 'nordic' | 'vintage';

export interface Book {
  id: string;
  type: 'book' | 'photo'; // Distinguish content type
  title: string;
  author?: string; // Optional for photos
  year?: number;   // Optional for photos
  category: string;
  coverUrl: string; // UI usage
  cover_url?: string; // DB field
  description: string;
  status: 'published' | 'draft';
  pages?: string[]; // Array of image URLs for pages (Books only)
}

export interface User {
  name: string;
  email: string;
  bio: string;
  avatarUrl: string; // UI usage
  avatar_url?: string; // DB field
  role: 'admin' | 'viewer';
}

export interface NavItem {
  label: string;
  path: string;
}
