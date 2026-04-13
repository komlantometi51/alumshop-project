# AlumShop Frontend

Application Next.js pour afficher le catalogue de produits et gérer le panier.

## Installation

1. Assurez-vous que le backend tourne dans `backend/` et que `backend/.env` est configuré.
2. Installer les dépendances :

```bash
cd c:\Users\DELL\Downloads\alumshop-project\frontend
npm install
```

## Exécution

Lancer le serveur de développement :

```bash
npm run dev
```

Le site sera accessible par défaut sur `http://localhost:3000`.

## Configuration

- `NEXT_PUBLIC_API_URL` doit pointer vers l'API backend, par exemple :
  `http://localhost:3001/api`

## Pages principales

- `/` : catalogue avec recherche et liste de produits
- `/produits/[id]` : fiche produit
- `/login` : page de connexion
- `/panier` : panier et validation de commande

## Notes

- Le frontend utilise `AuthContext` pour stocker le token JWT en localStorage.
- Les commandes sont envoyées via l'API en utilisant le header `Authorization: Bearer <token>`.
