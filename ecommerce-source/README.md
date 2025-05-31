# E-commerce Platform - Code Source Complet

## Description
Plateforme e-commerce multilingue avec interface d'administration complète, support RTL pour l'arabe, et gestion avancée des commandes et produits.

## Technologies Utilisées
- React avec TypeScript
- Node.js/Express
- PostgreSQL avec Drizzle ORM
- Tailwind CSS + shadcn/ui
- Internationalisation (i18n) complète
- Interface responsive mobile-first

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer la base de données PostgreSQL :
```bash
# Créer la base de données et configurer DATABASE_URL dans .env
npm run db:push
```

3. Démarrer l'application :
```bash
npm run dev
```

## Structure du Projet

### Frontend (`client/`)
- `src/components/` - Composants UI réutilisables
- `src/pages/` - Pages de l'application
- `src/pages/admin/` - Interface d'administration
- `src/hooks/` - Hooks React personnalisés
- `src/lib/` - Utilitaires et configuration
- `src/providers/` - Fournisseurs de contexte

### Backend (`server/`)
- `index.ts` - Point d'entrée du serveur
- `routes.ts` - Routes API
- `storage.ts` - Interface de stockage
- `db.ts` - Configuration base de données

### Partagé (`shared/`)
- `schema.ts` - Schémas Drizzle et types TypeScript

## Fonctionnalités Principales

### Interface Client
- Catalogue de produits avec filtrage
- Système de commandes
- Support multilingue (Arabe, Français, Anglais)
- Interface responsive
- Notifications en temps réel

### Interface Admin
- Tableau de bord avec analytics
- Gestion des produits
- Gestion des commandes
- Gestion des catégories
- Paramètres du magasin
- Authentification sécurisée

### Internationalisation
- Support RTL pour l'arabe
- Traductions complètes
- Commutateur de langue dynamique

## Variables d'Environnement
```
DATABASE_URL=postgresql://...
NODE_ENV=development
```

## Scripts Disponibles
- `npm run dev` - Démarrage en mode développement
- `npm run build` - Build de production
- `npm run db:push` - Mise à jour du schéma de base de données

## Notes Importantes
- L'arabe est configuré comme langue par défaut
- Interface d'administration accessible via `/admin`
- Système de notifications en temps réel pour les nouvelles commandes
- Données authentiques uniquement (pas de données factices)