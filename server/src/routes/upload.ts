import { Router, Request, Response } from 'express';
import multer from 'multer';
import { supabaseAdmin } from '../config/supabase.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload image to Supabase Storage
router.post('/', authMiddleware, upload.single('file'), async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file provided' });
            return;
        }

        const file = req.file;
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = `uploads/${fileName}`;

        // Upload to Supabase Storage
        const { data, error } = await supabaseAdmin.storage
            .from('book-images')
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }

        // Get public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('book-images')
            .getPublicUrl(filePath);

        res.json({
            url: publicUrl,
            path: data.path
        });
    } catch (error) {
        res.status(500).json({ error: 'Upload failed' });
    }
});

export default router;
