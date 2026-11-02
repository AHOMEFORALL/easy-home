# Plan d’implémentation — EazyHome

## Périmètre de la première itération

Reprendre la base React/Vite/Supabase existante du dépôt `AHOMEFORALL/easy-home` et la structurer progressivement sans supprimer les fonctionnalités déjà opérationnelles : authentification, récupération des annonces, publication, recherche, filtres et favoris. La première livraison dans ce projet géré fournit une interface web responsive cohérente, une page d’accueil immobilière claire, une recherche avec filtres, un espace de publication, une messagerie/notifications préparée et des états de chargement, erreur et absence de données.

Les fonctionnalités exigeant une base Supabase réellement configurée resteront branchées sur les services existants ou protégées par des états explicites ; aucune donnée réelle ne sera supprimée ni remplacée silencieusement par des données fictives en cas de panne.

## Architecture proposée

- `src/App.jsx` : orchestration de session, navigation principale et composition des écrans.
- `src/components/` : composants réutilisables tels que barre supérieure, navigation latérale, carte d’annonce, filtres et modales.
- `src/pages/` : écrans Accueil, Favoris, Profil, Messagerie et Notifications lorsque leur extraction est stabilisée.
- `src/services/` : accès Supabase centralisés pour les profils, propriétés, favoris, messages et notifications.
- `src/hooks/` : hooks de session, chargement des annonces, filtres et persistance locale.
- `src/contexts/` : session, thème et langue si leur extraction réduit le couplage.
- `src/utils/` : formatage XAF, normalisation de recherche et validations.
- `src/assets/` : logo et ressources visuelles existantes.
- `public/manus-routes.json` : route manifest avec la route `/` de l’application actuelle.

## Design retenu

Trois directions évaluées :

1. *Communauté orange chaleureuse* — probabilité 0,07.
2. *Luxe immobilier noir et sable* — probabilité 0,06.
3. *Néon urbain très contrasté* — probabilité 0,04.

Direction retenue : **Communauté orange chaleureuse**, car elle prolonge le langage visuel déjà présent dans l’application et évoque la proximité, l’énergie et l’action sans perdre la lisibilité.

- **Mouvement visuel :** éditorial social moderne, inspiré des fils d’actualité mais adapté à la recherche immobilière.
- **Principes :** confiance locale, lecture rapide, hiérarchie forte, actions visibles.
- **Couleurs :** orange signature pour les actions et la chaleur de marque ; charbon pour les titres ; fonds ivoire et gris très clair pour séparer les surfaces ; vert réservé aux états positifs.
- **Mise en page :** composition en trois zones sur desktop — navigation, fil d’annonces, aide contextuelle — puis réduction fluide en une colonne sur mobile avec barre d’actions basse.
- **Éléments signature :** marque orange en forme de maison, badges de disponibilité, cartes d’annonce à image dominante et rail de filtres compact.
- **Interactions :** actions immédiates et réversibles, favoris visibles, confirmations courtes, erreurs proches du champ concerné.
- **Animation :** transitions discrètes de 160–220 ms, apparition douce des cartes, aucun mouvement décoratif permanent.
- **Typographie :** système sans-serif proche d’Inter pour conserver la densité et la clarté ; titres compacts, libellés courts, prix très lisibles.
- **Essence de marque :** la plateforme qui rend la recherche et la mise en location plus simples et plus sûres au Cameroun. Personnalité : directe, rassurante, locale.
- **Voix :** chaleureuse, concrète, non administrative. Exemples : « Trouve ton prochain chez-toi. » et « Publie en quelques étapes, échange directement. »
- **Wordmark :** nom EazyHome associé à un pictogramme de maison minimal formé par un toit et une porte, sans illustration décorative lourde.

## Données et sécurité

Conserver les variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY` uniquement dans l’environnement. Centraliser les requêtes et ne jamais exposer `service_role`. Les opérations futures sur favoris, conversations, signalements et modération devront être protégées par RLS et par le contrôle de rôle côté serveur ; masquer un bouton ne constitue pas une protection.

## Flux de livraison

1. Copier la base existante dans le projet géré et vérifier le build initial.
2. Ajouter la déclaration de routes et les métadonnées du projet.
3. Extraire ou corriger les parties à faible risque : structure, états, accessibilité, responsive et cohérence du thème.
4. Configurer les diagnostics JavaScript et corriger les erreurs signalées.
5. Lancer le serveur Vite sur le port configuré, vérifier `/manus-routes.json` et le build.
6. Utiliser la capture d’écran seulement pour contrôler l’interface après une première validation de code.
7. Enregistrer un checkpoint avec les fichiers réellement modifiés ; ne pas publier automatiquement.
