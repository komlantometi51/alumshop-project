import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

const router = Router();
const SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
  const { nom, email, telephone, password, type } = req.body;
  const hash = await bcrypt.hash(password, 12);

  try {
    const { rows: [client] } = await pool.query(
      `INSERT INTO clients (nom, email, telephone, type)
       VALUES ($1,$2,$3,$4) RETURNING id, nom, email, type`,
      [nom, email, telephone, type ?? 'particulier']
    );

    await pool.query(
      `INSERT INTO auth_credentials (client_id, password_hash)
       VALUES ($1,$2)`,
      [client.id, hash]
    );

    const token = jwt.sign({ sub: client.id, type: client.type }, SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, client });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Email déjà utilisé' });
    throw e;
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await pool.query(
    `SELECT c.*, a.password_hash
     FROM clients c
     JOIN auth_credentials a ON a.client_id = c.id
     WHERE c.email = $1`,
    [email]
  );
  const user = rows[0];
  if (!user) return res.status(401).json({ error: 'Identifiants invalides' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Identifiants invalides' });

  const token = jwt.sign({ sub: user.id, type: user.type }, SECRET, { expiresIn: '7d' });
  const { password_hash, ...client } = user;
  res.json({ token, client });
});

export default router;
