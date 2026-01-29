import { Router, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get current user profile
router.get('/profile', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { data, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', req.user!.id)
            .single();

        if (error) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Update user profile
router.put('/profile', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, bio, avatar_url } = req.body;

        const updateData: any = {
            updated_at: new Date().toISOString()
        };

        if (name !== undefined) updateData.name = name;
        if (bio !== undefined) updateData.bio = bio;
        if (avatar_url !== undefined) updateData.avatar_url = avatar_url;

        const { data, error } = await supabaseAdmin
            .from('users')
            .update(updateData)
            .eq('id', req.user!.id)
            .select()
            .single();

        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

export default router;
