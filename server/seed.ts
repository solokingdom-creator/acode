import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase configuration in server/.env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
    console.log('Starting seed...');

    // 1. Insert/Get Admin User
    const { data: userData, error: userError } = await supabase
        .from('users')
        .upsert({
            name: 'Artist Admin',
            email: 'admin@example.com',
            role: 'admin',
            bio: 'Nordic-born illustrator based in Copenhagen.'
        }, { onConflict: 'email' })
        .select()
        .single();

    if (userError) {
        console.error('Error seeding user:', userError);
        return;
    }
    if (userError) {
        console.error('Error seeding user:', userError);
        return;
    }
    console.log('Admin user profile seeded.');

    // 1.5 Create Supabase Auth User
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: 'admin@example.com',
        password: 'password123',
        email_confirm: true,
        user_metadata: { name: 'Artist Admin' }
    });

    if (authError) {
        console.log('Auth user might already exist or error:', authError.message);
    } else {
        console.log('Auth user created: admin@example.com / password123');
    }

    // 2. Insert Books
    const books = [
        {
            type: 'book',
            title: 'The Silent Forest',
            author: 'Elin Lindquist',
            year: 2026,
            category: 'Nature',
            status: 'published',
            cover_url: 'https://picsum.photos/seed/forest/600/800',
            description: 'In the heart of the northern wild, the trees hold secrets that only the snow can hear.',
            created_by: userData.id
        },
        {
            type: 'book',
            title: 'Whiskers & Wind',
            author: 'Independent Press',
            year: 2022,
            category: 'Folklore',
            status: 'published',
            cover_url: 'https://picsum.photos/seed/cat/600/800',
            description: 'A tale of a cat who traveled across the windy plains.',
            created_by: userData.id
        }
    ];

    const { error: bookError } = await supabase.from('books').insert(books);
    if (bookError) console.error('Error seeding books:', bookError);
    else console.log('Books seeded.');

    // 3. Insert Photos
    const photos = [
        {
            type: 'photo',
            title: 'Morning Coffee',
            year: 2026,
            category: 'Life',
            status: 'published',
            cover_url: 'https://picsum.photos/seed/wall1/800/1000',
            description: 'A quiet start to the day.',
            created_by: userData.id
        },
        {
            type: 'photo',
            title: 'Studio Light',
            year: 2026,
            category: 'Work',
            status: 'published',
            cover_url: 'https://picsum.photos/seed/wall3/800/1200',
            description: 'The way the light hits the easel today.',
            created_by: userData.id
        }
    ];

    const { error: photoError } = await supabase.from('books').insert(photos);
    if (photoError) console.error('Error seeding photos:', photoError);
    else console.log('Photos seeded.');

    console.log('Seed completed!');
}

seed();
