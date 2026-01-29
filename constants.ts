
import { Book, User } from './types';

export const MOCK_USER: User = {
  name: "Artist Admin",
  email: "hello@nordic-illustrator.com",
  role: "admin",
  avatarUrl: "https://picsum.photos/seed/user1/200/200",
  bio: "Nordic-born illustrator based in Copenhagen. I specialize in atmospheric, texture-rich illustrations for children's picture books and editorial features."
};

export const MOCK_BOOKS: Book[] = [
  // BOOKS
  {
    id: "1",
    type: 'book',
    title: "The Silent Forest",
    author: "Elin Lindquist",
    year: 2026,
    category: "Nature",
    status: "published",
    coverUrl: "https://picsum.photos/seed/forest/600/800",
    description: "In the heart of the northern wild, the trees hold secrets that only the snow can hear. As twilight settles over the silver birches, a hush falls across the valley.",
    pages: [
      "https://picsum.photos/seed/page1/800/600",
      "https://picsum.photos/seed/page2/800/600",
      "https://picsum.photos/seed/page3/800/600"
    ]
  },
  {
    id: "2",
    type: 'book',
    title: "The Golden Afternoon",
    author: "Aris Thorne",
    year: 1924,
    category: "Classics",
    status: "published",
    coverUrl: "https://picsum.photos/seed/golden/600/800",
    description: "The rays of the setting sun cast long, amber shadows across the study of Dr. Aris Thorne. On the desk lay the original manuscript.",
    pages: []
  },
  {
    id: "3",
    type: 'book',
    title: "Whiskers & Wind",
    author: "Independent Press",
    year: 2022,
    category: "Folklore",
    status: "draft",
    coverUrl: "https://picsum.photos/seed/cat/600/800",
    description: "A tale of a cat who traveled across the windy plains to find the source of the whispering breeze.",
    pages: []
  },
  {
    id: "4",
    type: 'book',
    title: "Midnight Sun",
    author: "Sven Jørgensen",
    year: 2023,
    category: "Fantasy",
    status: "published",
    coverUrl: "https://picsum.photos/seed/midnight/600/800",
    description: "When the sun never sets, the magic never sleeps. Join Sven on a journey through the endless day.",
    pages: []
  },
  // PHOTOS (Photo Wall Content)
  {
    id: "p1",
    type: 'photo',
    title: "Morning Coffee",
    category: "Life",
    status: "published",
    coverUrl: "https://picsum.photos/seed/wall1/800/1000",
    description: "A quiet start to the day.",
    year: 2026
  },
  {
    id: "p2",
    type: 'photo',
    title: "Street Corner",
    category: "Travel",
    status: "published",
    coverUrl: "https://picsum.photos/seed/wall2/800/600",
    description: "Walking through the old town.",
    year: 2026
  },
  {
    id: "p3",
    type: 'photo',
    title: "Studio Light",
    category: "Work",
    status: "published",
    coverUrl: "https://picsum.photos/seed/wall3/800/1200",
    description: "The way the light hits the easel today.",
    year: 2026
  },
  {
    id: "p4",
    type: 'photo',
    title: "Winter Walk",
    category: "Nature",
    status: "published",
    coverUrl: "https://picsum.photos/seed/wall4/800/900",
    description: "Snow covered paths.",
    year: 2026
  },
   {
    id: "p5",
    type: 'photo',
    title: "Sketching",
    category: "Work",
    status: "draft",
    coverUrl: "https://picsum.photos/seed/wall5/800/800",
    description: "Work in progress.",
    year: 2026
  }
];

export const CATEGORIES = ["All", "Nature", "Folklore", "Fantasy", "History", "Classics", "Life", "Travel", "Work"];
