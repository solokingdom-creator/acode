import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get all books (public)
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { type, status, category } = req.query;

        let query = supabaseAdmin.from('books').select('*');

        if (type) {
            query = query.eq('type', type);
        }

        if (status) {
            query = query.eq('status', status);
        } else {
            // Default to published only for public
            query = query.eq('status', 'published');
        }

        if (category && category !== 'All') {
            query = query.eq('category', category);
        }

        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;

        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

// Get single book (public)
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const { data, error } = await supabaseAdmin
            .from('books')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            res.status(404).json({ error: 'Book not found' });
            return;
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch book' });
    }
});

// Create book (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { type, title, author, year, category, cover_url, description, status, pages } = req.body;

        if (!type || !title || !category || !cover_url) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        const { data, error } = await supabaseAdmin
            .from('books')
            .insert({
                type,
                title,
                author,
                year,
                category,
                cover_url,
                description,
                status: status || 'draft',
                pages: pages || [],
                created_by: req.user!.id
            })
            .select()
            .single();

        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }

        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create book' });
    }
});

// Update book (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { type, title, author, year, category, cover_url, description, status, pages } = req.body;

        const updateData: any = {
            updated_at: new Date().toISOString()
        };

        if (type !== undefined) updateData.type = type;
        if (title !== undefined) updateData.title = title;
        if (author !== undefined) updateData.author = author;
        if (year !== undefined) updateData.year = year;
        if (category !== undefined) updateData.category = category;
        if (cover_url !== undefined) updateData.cover_url = cover_url;
        if (description !== undefined) updateData.description = description;
        if (status !== undefined) updateData.status = status;
        if (pages !== undefined) updateData.pages = pages;

        const { data, error } = await supabaseAdmin
            .from('books')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update book' });
    }
});

// Delete book (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const { error } = await supabaseAdmin
            .from('books')
            .delete()
            .eq('id', id);

        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }

        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete book' });
    }
});

export default router;
