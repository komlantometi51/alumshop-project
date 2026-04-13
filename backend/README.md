# AlumShop Backend

API Express pour la gestion des produits, des commandes, de l'authentification et des paiements.

## Installation

1. Copier `backend/.env.example` en `backend/.env`
2. Remplir les variables d'environnement :
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `CLOUDINARY_*`
   - `CINETPAY_*`
   - `FRONTEND_URL`
3. Installer les dépendances :

```bash
cd c:\Users\DELL\Downloads\alumshop-project\backend
npm install
```

## Exécution

- Exécuter les migrations :

```bash
npm run migrate
```

- Démarrer le serveur :

```bash
npm start
```

Le serveur écoute par défaut sur le port `3001`.

## Routes principales

- `POST /api/auth/register` : créer un client
- `POST /api/auth/login` : authentifier un client
- `GET /api/produits` : lister les produits
- `GET /api/produits/:id` : obtenir un produit
- `POST /api/produits` : créer un produit (admin)
- `PATCH /api/produits/:id` : modifier un produit (admin)
- `POST /api/commandes` : créer une commande (authentifié)
- `GET /api/commandes/:id` : récupérer une commande (authentifié)
- `POST /api/paiement/initier` : initier un paiement CinetPay (authentifié)
- `POST /api/paiement/webhook` : webhook de notification

## Base de données

Les scripts de migration créent les tables suivantes :

- `categories`
- `produits`
- `clients`
- `auth_credentials`
- `commandes`
- `lignes_commande`
- `transactions`

## Notes

Ce backend est prêt à être utilisé en local ou déployé sur un service compatible Node.js.
