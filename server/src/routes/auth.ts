import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';

const router = Router();

// Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Email and password required' });
            return;
        }

        const { data, error } = await supabaseAdmin.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            res.status(401).json({ error: error.message });
            return;
        }

        // Get user details
        const { data: userData } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        res.json({
            user: userData,
            session: data.session
        });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Logout
router.post('/logout', async (req: Request, res: Response): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            await supabaseAdmin.auth.admin.signOut(token);
        }
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Logout failed' });
    }
});

// Get current user
router.get('/me', async (req: Request, res: Response): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }

        const token = authHeader.substring(7);
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

        if (error || !user) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }

        const { data: userData } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', user.email)
            .single();

        res.json({ user: userData });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get user' });
    }
});

export default router;
