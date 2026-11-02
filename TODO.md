# TODO — EazyHome

## Base et continuité

- [ ] Reprendre la base React/Vite/Supabase existante sans supprimer les fonctionnalités déjà opérationnelles : connexion, annonces, publication, recherche, filtres et favoris.
- [ ] Conserver les variables d’environnement `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY` hors du dépôt.
- [ ] Organiser progressivement le code en composants, pages, services, hooks, contexts, utils et assets.

## Expérience web prioritaire

- [ ] Afficher les annonces sur un fil d’accueil avec photos, titre, prix en FCFA, ville, quartier, type, chambres, superficie, disponibilité, bailleur et accès aux détails.
- [ ] Permettre la recherche par ville, quartier, prix min/max, type, chambres et meublé/non meublé ; prévoir tri et pagination ou chargement progressif.
- [ ] Permettre l’ajout, le retrait et la consultation de favoris persistants après déconnexion/reconnexion.
- [ ] Prévoir les espaces Accueil, Notifications, Messagerie et Profil, avec états vides et messages d’erreur compréhensibles.
- [ ] Permettre au bailleur de publier, modifier, supprimer et marquer ses propres annonces, avec photos et statuts `available`, `rented`, `sold`, `pending`.

## Sécurité et données

- [ ] Appliquer les autorisations côté serveur et dans les politiques RLS ; un bailleur ne modifie que ses annonces et un utilisateur ne modifie que ses données.
- [ ] Réserver les opérations administratives aux comptes administrateurs ; ne jamais exposer `service_role` ni publier `.env.local`.
- [ ] Préparer les tables `favorites`, `conversations`, `messages`, `notifications`, `reports`, `property_images`, `verification_requests` et `audit_logs` avec clés étrangères et contraintes adaptées.
- [ ] Préparer le signalement des annonces/utilisateurs, la modération, l’historique des modifications et la revue humaine des doublons.

## Qualité, localisation et déploiement

- [ ] Prendre en charge le français et l’anglais avec des textes centralisés ; utiliser le franc CFA/XAF et le contexte Yaoundé/Douala.
- [ ] Assurer responsive, accessibilité, chargement, erreurs réseau, confirmations et pages vides ; optimiser les images et limiter les requêtes.
- [ ] Servir `public/manus-routes.json` avec la route `/` et le maintenir synchronisé avec les routes réelles.
- [ ] Vérifier `npm run build` et le déploiement Vercel avec les variables d’environnement configurées dans les environnements appropriés.
- [ ] Enregistrer un checkpoint géré après validation ; ne pas supprimer de données ni publier sans demande explicite.
