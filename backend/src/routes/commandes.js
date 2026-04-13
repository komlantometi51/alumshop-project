import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

// POST /commandes
router.post('/', async (req, res) => {
  const { lignes } = req.body;
  const client_id = req.user.sub;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let total_ht = 0;
    const lignesEnrichies = [];

    for (const ligne of lignes) {
      const { rows } = await client.query(
        'SELECT id, nom, prix_ht, stock FROM produits WHERE id = $1 FOR UPDATE',
        [ligne.produit_id]
      );
      const produit = rows[0];
      if (!produit) throw new Error(`Produit ${ligne.produit_id} introuvable`);
      if (produit.stock < ligne.quantite)
        throw new Error(`Stock insuffisant pour "${produit.nom}"`);

      total_ht += produit.prix_ht * ligne.quantite;
      lignesEnrichies.push({ ...ligne, prix_unitaire: produit.prix_ht });
    }

    const { rows: [commande] } = await client.query(
      `INSERT INTO commandes (client_id, total_ht, statut)
       VALUES ($1, $2, 'en_attente') RETURNING *`,
      [client_id, total_ht]
    );

    for (const l of lignesEnrichies) {
      await client.query(
        `INSERT INTO lignes_commande (commande_id, produit_id, quantite, prix_unitaire)
         VALUES ($1, $2, $3, $4)`,
        [commande.id, l.produit_id, l.quantite, l.prix_unitaire]
      );
      await client.query(
        'UPDATE produits SET stock = stock - $1 WHERE id = $2',
        [l.quantite, l.produit_id]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ ...commande, lignes: lignesEnrichies });

  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
});

// GET /commandes/:id
router.get('/:id', async (req, res) => {
  const { rows: [commande] } = await pool.query(
    'SELECT * FROM commandes WHERE id = $1',
    [req.params.id]
  );
  if (!commande) return res.status(404).json({ error: 'Commande introuvable' });

  const { rows: lignes } = await pool.query(
    `SELECT lc.*, p.nom, p.reference, p.images
     FROM lignes_commande lc
     JOIN produits p ON p.id = lc.produit_id
     WHERE lc.commande_id = $1`,
    [req.params.id]
  );
  res.json({ ...commande, lignes });
});

// PATCH /commandes/:id/statut
router.patch('/:id/statut', requireAdmin, async (req, res) => {
  const { statut } = req.body;
  const valides = ['en_attente','confirmee','expediee','livree','annulee'];
  if (!valides.includes(statut))
    return res.status(400).json({ error: 'Statut invalide' });

  const { rows: [updated] } = await pool.query(
    'UPDATE commandes SET statut = $1 WHERE id = $2 RETURNING *',
    [statut, req.params.id]
  );
  res.json(updated);
});

export default router;
