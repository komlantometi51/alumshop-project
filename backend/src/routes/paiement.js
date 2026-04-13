import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const CINETPAY_URL = 'https://api-checkout.cinetpay.com/v2/payment';

router.post('/initier', requireAuth, async (req, res) => {
  const { commande_id } = req.body;

  const { rows: [commande] } = await pool.query(
    `SELECT c.*, cl.email, cl.nom AS client_nom, cl.telephone
     FROM commandes c
     JOIN clients cl ON cl.id = c.client_id
     WHERE c.id = $1`,
    [commande_id]
  );
  if (!commande) return res.status(404).json({ error: 'Commande introuvable' });

  const transaction_id = `TXN-${commande_id.slice(0,8)}-${Date.now()}`;
  const montant = Math.round(commande.total_ht);

  const payload = {
    apikey: process.env.CINETPAY_API_KEY,
    site_id: process.env.CINETPAY_SITE_ID,
    transaction_id,
    amount: montant,
    currency: 'XOF',
    description: `Commande ${commande_id.slice(0,8)}`,
    customer_name: commande.client_nom,
    customer_email: commande.email,
    customer_phone_number: commande.telephone,
    customer_address: 'Lomé',
    customer_city: 'Lomé',
    customer_country: 'TG',
    customer_state: 'TG',
    customer_zip_code: '00228',
    notify_url: process.env.CINETPAY_NOTIFY_URL,
    return_url: `${process.env.FRONTEND_URL}/commandes/${commande_id}/confirmation`,
    channels: 'ALL',
    lang: 'FR',
    metadata: commande_id,
  };

  const response = await fetch(CINETPAY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  if (data.code !== '201') {
    return res.status(502).json({ error: data.message });
  }

  await pool.query(
    `INSERT INTO transactions (commande_id, provider_id, montant, statut)
     VALUES ($1,$2,$3,'en_attente')`,
    [commande_id, transaction_id, montant]
  );

  res.json({ payment_url: data.data.payment_url, transaction_id });
});

router.post('/webhook', async (req, res) => {
  const { cpm_trans_id, cpm_result, cpm_trans_status, cpm_custom } = req.body;
  const commande_id = cpm_custom;
  const statut_paiement = cpm_result === '00' ? 'paye' : 'echec';
  const statut_commande = cpm_result === '00' ? 'confirmee' : 'en_attente';

  await pool.query(
    `UPDATE transactions SET statut = $1 WHERE provider_id = $2`,
    [statut_paiement, cpm_trans_id]
  );

  if (cpm_result === '00') {
    await pool.query(
      `UPDATE commandes SET statut = $1 WHERE id = $2`,
      [statut_commande, commande_id]
    );
  }

  res.json({ message: '200' });
});

export default router;
