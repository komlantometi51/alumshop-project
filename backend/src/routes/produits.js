import { Router } from 'express';
import { pool } from '../db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /produits?categorie=&q=&page=&limit=
router.get('/', async (req, res) => {
  const { categorie, q, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const params = [];
  let where = 'WHERE p.actif = TRUE';

  if (categorie) {
    params.push(categorie);
    where += ` AND p.categorie_id = $${params.length}`;
  }
  if (q) {
    params.push(`%${q}%`);
    where += ` AND (p.nom ILIKE $${params.length} OR p.reference ILIKE $${params.length})`;
  }

  params.push(limit, offset);
  const sql = `
    SELECT p.*, c.nom AS categorie_nom
    FROM produits p
    LEFT JOIN categories c ON c.id = p.categorie_id
    ${where}
    ORDER BY p.created_at DESC
    LIMIT $${params.length - 1} OFFSET $${params.length}
  `;

  const { rows } = await pool.query(sql, params);
  res.json({ data: rows, page: +page, limit: +limit });
});

// GET /produits/:id
router.get('/:id', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT p.*, c.nom AS categorie_nom
     FROM produits p
     LEFT JOIN categories c ON c.id = p.categorie_id
     WHERE p.id = $1`,
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Produit introuvable' });
  res.json(rows[0]);
});

// POST /produits
router.post('/', requireAdmin, async (req, res) => {
  const { nom, reference, description, prix_ht, stock, unite, categorie_id, images } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO produits (nom, reference, description, prix_ht, stock, unite, categorie_id, images)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [nom, reference, description, prix_ht, stock, unite, categorie_id, images]
  );
  res.status(201).json(rows[0]);
});

// PATCH /produits/:id
router.patch('/:id', requireAdmin, async (req, res) => {
  const fields = ['nom','prix_ht','stock','description','actif'];
  const updates = [];
  const values = [];

  fields.forEach(f => {
    if (req.body[f] !== undefined) {
      values.push(req.body[f]);
      updates.push(`${f} = $${values.length}`);
    }
  });
  if (!updates.length) return res.status(400).json({ error: 'Aucun champ à mettre à jour' });

  values.push(req.params.id);
  const { rows } = await pool.query(
    `UPDATE produits SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`,
    values
  );
  res.json(rows[0]);
});

export default router;
