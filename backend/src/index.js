import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import produitsRouter from './routes/produits.js';
import commandesRouter from './routes/commandes.js';
import authRouter from './routes/auth.js';
import paiementRouter from './routes/paiement.js';
import imagesRouter from './routes/images.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/produits', produitsRouter);
app.use('/api/commandes', commandesRouter);
app.use('/api/paiement', paiementRouter);
app.use('/api/images', imagesRouter);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API démarrée sur :${port}`));
