# AlumShop

Projet séparé en deux applications : backend Express et frontend Next.js.

## Structure

- `backend/` : API Express, PostgreSQL, routes et migrations
- `frontend/` : application Next.js, pages et composants React

## Backend

1. Copier `backend/.env.example` en `backend/.env`
2. Ajuster `DATABASE_URL`, `JWT_SECRET`, `CLOUDINARY_*`, `CINETPAY_*`
3. Installer les dépendances :

```bash
cd c:\Users\DELL\Downloads\alumshop-project\backend
npm install
```

4. Exécuter les migrations :

```bash
npm run migrate
```

5. Lancer le serveur :

```bash
npm start
```

## Frontend

1. Installer les dépendances :

```bash
cd c:\Users\DELL\Downloads\alumshop-project\frontend
npm install
```

2. Lancer l'application Next.js :

```bash
npm run dev
```

## Connexion backend/frontend

- Le frontend appelle l'API via `NEXT_PUBLIC_API_URL`
- Les commandes sont créées avec un jeton JWT envoyé dans l'en-tête `Authorization`
- Les fichiers sont séparés pour une architecture claire et maintenable
