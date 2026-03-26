# LoyaltyCard

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-BDD?logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss&logoColor=white)

## Présentation

LoyaltyCard est un SaaS de cartes de fidélité numériques destiné aux petits commerces (boulangeries, cafés, épiceries, etc.). Un commerçant crée et gère ses programmes de fidélité, suit ses clients et distribue des tampons digitaux via QR code. Les clients accumulent des tampons et débloquent des récompenses sans aucune carte physique.

---

## Lien de production

[https://archi-front-ten.vercel.app/](https://archi-front-ten.vercel.app/)

---

## Stack technique et justification des choix

### Vite — et pas Next.js

LoyaltyCard est une **SPA côté client** : pas de besoin de SSR, pas de SEO critique sur les pages protégées, et le rendu côté serveur aurait ajouté une complexité inutile. Vite offre un démarrage quasi-instantané, du HMR ultra-rapide et une configuration minimaliste — idéal pour un projet front-end pur avec une API externe (Supabase).

### Supabase

Supabase fournit en un seul service : une base PostgreSQL hébergée, une API REST et Realtime auto-générée, une authentification prête à l'emploi (JWT, sessions, refresh tokens) et un stockage de fichiers. Cela évite de maintenir un backend Node/Express dédié et accélère considérablement le développement.

### Zustand

State manager léger, sans boilerplate, avec un API hooks-first. Utilisé pour les préférences globales du commerçant (nom, couleur de marque) avec le middleware `persist` pour la sauvegarde automatique en `localStorage`. Aucun besoin de Redux pour ce volume de state global.

### React Query (@tanstack/react-query)

Gère tout le data fetching : cache automatique, déduplication des requêtes, invalidation ciblée après mutation, états `isLoading` / `isError` prêts à l'emploi. Remplace entièrement les `useEffect` de fetch, rendant le code prévisible et testable.

### Zod

Validation de schémas TypeScript-first. Couplé à React Hook Form via `@hookform/resolvers`, il garantit que les données saisies dans les formulaires sont valides avant tout envoi à Supabase. Les types sont inférés depuis les schémas Zod (`z.infer<typeof schema>`), éliminant toute duplication type/validation.

### Chart.js (+ react-chartjs-2)

Bibliothèque de visualisation légère et bien documentée. Utilisée dans le tableau de bord pour afficher les statistiques du commerçant (tampons distribués, progression des programmes). `react-chartjs-2` fournit les wrappers React officiels.

### html5-qrcode

Permet la lecture de QR codes directement depuis la caméra du navigateur, sans dépendance native. Utilisé dans la feature `scan-customer` pour identifier un client via son QR code lors de l'ajout de tampons. `qrcode.react` est utilisé côté client pour générer les QR codes.

---

## Architecture FSD (Feature Sliced Design)

```
src/
├── app/                          → Providers globaux (QueryClient, Router), styles globaux
│   └── providers/                → Configuration de TanStack Query, React Router
│
├── pages/                        → Vues assemblées, une par route
│   ├── landing/                  → Page d'accueil publique avec CTA
│   ├── auth/                     → Page d'inscription / connexion
│   ├── dashboard/                → Statistiques globales du commerçant
│   ├── customers/                → Liste des clients avec recherche et filtres
│   ├── customer-detail/          → Fiche client, historique tampons
│   ├── programs/                 → CRUD des programmes de fidélité
│   ├── profile/                  → Paramètres du profil commerçant
│   ├── scan/                     → Scan QR code pour identifier un client
│   ├── wallet/                   → Carte de fidélité côté client
│   ├── progression/              → Suivi visuel de progression des programmes
│   └── error/                    → Page d'erreur 404 / générique
│
├── widgets/                      → Blocs UI autonomes et réutilisables
│   ├── header/                   → Barre de navigation supérieure
│   ├── sidebar/                  → Menu latéral de navigation
│   └── main-layout/              → Layout principal wrappant les pages protégées
│
├── features/                     → Actions utilisateur encapsulées
│   ├── auth/                     → Inscription, connexion, déconnexion (Supabase Auth)
│   ├── add-customer/             → Formulaire d'ajout d'un client
│   ├── create-program/           → Formulaire de création d'un programme de fidélité
│   ├── scan-customer/            → Lecture QR code via caméra (html5-qrcode)
│   ├── update-profile/           → Modification du profil commerçant
│   └── change-password/          → Changement de mot de passe
│
├── entities/                     → Modèles métier et accès aux données
│   ├── merchant/                 → Store Zustand + hooks React Query commerçant
│   ├── customer/                 → Types, hooks de fetch et mutations clients
│   ├── program/                  → Types, hooks de fetch et mutations programmes
│   └── stamp/                    → Types, hooks de fetch, composant carte tampon
│
└── shared/                       → Code générique sans logique métier
    ├── api/                      → Instance Supabase partagée
    ├── lib/                      → Utilitaires (seed, helpers)
    └── ui/                       → Composants UI génériques (boutons, inputs, etc.)
```

**Règle d'imports** : chaque couche n'importe que depuis les couches inférieures (`features` → `entities` → `shared`). Pas d'import circulaire. Chaque slice expose uniquement via son `index.ts`.

---

## Installation et lancement en local

```bash
# Cloner le dépôt
git clone https://github.com/<votre-org>/archi-front.git
cd archi-front

# Installer les dépendances
npm install
```

Créer un fichier `.env.local` à la racine avec les variables suivantes :

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> Ces valeurs sont disponibles dans le dashboard Supabase → **Project Settings → API**.

```bash
# Lancer le serveur de développement
npm run dev
```

L'application est disponible sur [http://localhost:5173](http://localhost:5173).

---

## Commandes utiles

```bash
# Build de production
npm run build

# Vérification TypeScript sans build
npm run typecheck

# Lancer les tests (Vitest)
npm run test

# Interface Vitest avec UI
npm run test:ui

# Linter ESLint
npm run lint

# Prévisualiser le build de production
npm run preview
```

---

## Déploiement sur Vercel

### Prérequis

- Un compte [Vercel](https://vercel.com) connecté à votre compte GitHub
- Les valeurs `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` disponibles dans le dashboard Supabase → **Project Settings → API**

### Étapes

1. **Connecter le dépôt** — depuis le dashboard Vercel, cliquer sur **Add New Project** et importer le dépôt `archi-front`.

2. **Configurer le framework** — Vercel détecte automatiquement Vite. Laisser les réglages par défaut (`npm run build`, dossier de sortie `dist`).

3. **Ajouter les variables d'environnement** — dans l'onglet **Environment Variables** avant de déployer, ajouter :

   | Variable | Valeur |
   |---|---|
   | `VITE_SUPABASE_URL` | URL de votre projet Supabase |
   | `VITE_SUPABASE_ANON_KEY` | Clé publique anon de votre projet Supabase |

4. **Déployer** — cliquer sur **Deploy**. Vercel exécute `npm run build` et publie le contenu du dossier `dist`.

Le fichier `vercel.json` à la racine configure le rewrite `/*` → `/index.html`, ce qui permet à React Router de gérer la navigation côté client sans erreur 404 sur les routes directes.

---
