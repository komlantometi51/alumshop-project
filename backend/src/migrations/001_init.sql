-- Extensions PostgreSQL nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Catégories
CREATE TABLE categories (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom        VARCHAR(100) NOT NULL,
  slug       VARCHAR(100) UNIQUE NOT NULL,
  parent_id  UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Produits
CREATE TABLE produits (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom          VARCHAR(200) NOT NULL,
  reference    VARCHAR(50) UNIQUE NOT NULL,
  description  TEXT,
  prix_ht      NUMERIC(10,2) NOT NULL,
  stock        INTEGER NOT NULL DEFAULT 0,
  unite        VARCHAR(20) DEFAULT 'unité',
  categorie_id UUID REFERENCES categories(id),
  images       TEXT[],
  actif        BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Clients
CREATE TABLE clients (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom        VARCHAR(150) NOT NULL,
  email      VARCHAR(150) UNIQUE NOT NULL,
  telephone  VARCHAR(20),
  type       VARCHAR(20) DEFAULT 'particulier',
  adresse    JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE auth_credentials (
  client_id     UUID PRIMARY KEY REFERENCES clients(id) ON DELETE CASCADE,
  password_hash TEXT NOT NULL
);

-- Commandes
CREATE TABLE commandes (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id  UUID REFERENCES clients(id),
  statut     VARCHAR(30) DEFAULT 'en_attente',
  total_ht   NUMERIC(10,2),
  notes      TEXT,
  creee_le   TIMESTAMPTZ DEFAULT NOW()
);

-- Lignes de commande
CREATE TABLE lignes_commande (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  commande_id    UUID REFERENCES commandes(id) ON DELETE CASCADE,
  produit_id     UUID REFERENCES produits(id),
  quantite       INTEGER NOT NULL CHECK (quantite > 0),
  prix_unitaire  NUMERIC(10,2) NOT NULL
);

-- Transactions de paiement
CREATE TABLE transactions (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  commande_id    UUID REFERENCES commandes(id),
  provider_id    VARCHAR(100) UNIQUE,
  montant        INTEGER NOT NULL,
  statut         VARCHAR(20) DEFAULT 'en_attente',
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Index utiles
CREATE INDEX ON produits(categorie_id);
CREATE INDEX ON commandes(client_id);
CREATE INDEX ON lignes_commande(commande_id);
