import { Router } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { upload } from '../upload.js';
import { pool } from '../db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/produit/:id', requireAdmin, upload.array('images', 5), async (req, res) => {
  const urls = req.files.map(f => f.path);
  const { rows: [produit] } = await pool.query(
    `UPDATE produits
     SET images = array_cat(COALESCE(images, '{}'), $1::text[])
     WHERE id = $2
     RETURNING id, nom, images`,
    [urls, req.params.id]
  );
  res.json(produit);
});

router.delete('/produit/:id', requireAdmin, async (req, res) => {
  const { url } = req.body;
  const publicId = url.split('/').slice(-1)[0].split('.')[0];
  await cloudinary.uploader.destroy(`ecommerce-aluminium/${publicId}`);

  const { rows: [produit] } = await pool.query(
    `UPDATE produits
     SET images = array_remove(images, $1)
     WHERE id = $2
     RETURNING id, images`,
    [url, req.params.id]
  );

  res.json(produit);
});

export default router;
