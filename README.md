# LallaZina — Site e-commerce

Site e-commerce pour LallaZina, marque de mode féminine au Maroc. Bilingue français / arabe, catalogue filtrable, panier, commande avec paiement à la livraison, intégration WhatsApp, et back-office admin.

## Démarrer en local

```bash
npm install
npx prisma migrate dev   # crée la base SQLite (déjà fait si dev.db existe)
npm run seed              # (re)génère les données de démonstration
npm run dev
```

Site public : http://localhost:3000/fr (ou /ar)
Admin : http://localhost:3000/admin/login

**Identifiants admin de démo** (définis dans `.env`, à changer avant mise en ligne) :
- E-mail : `admin@lallazina.ma`
- Mot de passe : `LallaZina2026!`

## Ce qui est déjà fonctionnel

- Site public complet : accueil, boutique avec filtres/tri/recherche, fiche produit (tailles/couleurs/stock, guide des tailles), panier, checkout (paiement à la livraison), confirmation de commande, suivi de commande, pages Livraison / Retours & échanges / À propos / Contact / FAQ / CGV / Confidentialité.
- Bouton WhatsApp flottant + boutons contextuels avec message pré-rempli sur toutes les pages clés.
- Admin protégé par mot de passe : tableau de bord (CA, commandes, panier moyen, top produits/villes), gestion des produits (photos, tailles, couleurs, stock, promo), gestion des commandes (statuts), clientes (dérivées des commandes), messages de contact, paramètres (WhatsApp, réseaux sociaux, frais de livraison par ville, guide des tailles, politique de retours).
- Base de données réelle (SQLite via Prisma) : les produits ajoutés dans l'admin apparaissent immédiatement sur le site public.

## À personnaliser avant la mise en ligne réelle

Toutes ces valeurs sont actuellement des **données de démonstration**, modifiables directement depuis **Admin → Paramètres** (sauf mention contraire) :

- Numéro WhatsApp, réseaux sociaux (Instagram/Facebook/TikTok), e-mail et téléphone de contact, adresse de la boutique.
- Frais de livraison par ville et seuil de livraison gratuite.
- Guide des tailles et texte de la politique de retours/échanges.
- **Produits et photos** : remplacer les produits et les visuels de démonstration (illustrations abstraites générées, dossier `public/images`) par les vrais produits et photos, depuis **Admin → Produits**.
- Mot de passe admin et secrets (`.env`) avant toute mise en production.
- Textes des CGV / politique de confidentialité (`src/app/[locale]/cgv` et `/confidentialite`) : à faire valider par la boutique.

## Stack technique

Next.js 16 (App Router) + TypeScript, Tailwind CSS v4, Prisma + SQLite, next-intl (FR/AR), Zustand (panier), jose (session admin).
