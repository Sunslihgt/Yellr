# Migration du système de commentaires

## Changements effectués

Le système de commentaires a été migré pour fonctionner comme le système de posts au niveau de la récupération de l'auteur.

### Modifications principales

1. **Modèle de commentaire (`comment.model.ts`)** :
   - Remplacement de `authorEmail` et `authorUsername` par `authorId`
   - `authorId` référence maintenant l'ID de l'utilisateur avec `ref: 'User'`
   - Ajout d'un index sur `authorId`

2. **Contrôleur de commentaires (`comment.controller.ts`)** :
   - Utilisation de `JwtUserRequest` au lieu de `Request` pour les routes authentifiées
   - Récupération de l'`authorId` depuis le JWT token via `req.jwtUserId`
   - Utilisation de `.populate()` pour récupérer les informations complètes de l'auteur
   - Ajout de la fonction `likeComment` similaire à celle des posts
   - Gestion des utilisateurs supprimés avec un fallback

3. **Nouveaux fichiers créés** :
   - `@types/jwtRequest.ts` : Interface pour les requêtes avec JWT
   - `middlewares/currentUser.middleware.ts` : Middleware d'authentification JWT
   - `utils/comment.utils.ts` : Utilitaires pour les commentaires

4. **Routes (`comment.routes.ts`)** :
   - Ajout du middleware d'authentification pour les routes protégées
   - Nouvelle route pour liker les commentaires : `PUT /comments/:id/like`

5. **Dépendances (`package.json`)** :
   - Ajout de `jsonwebtoken` et `@types/jsonwebtoken`

### API Changes

#### Avant
```typescript
// Création d'un commentaire
POST /comments
{
  "content": "Contenu du commentaire",
  "authorEmail": "user@example.com",
  "authorUsername": "username",
  "postId": "postId"
}
```

#### Après
```typescript
// Création d'un commentaire (avec JWT token dans headers)
POST /comments
Authorization: Bearer <jwt_token>
{
  "content": "Contenu du commentaire",
  "postId": "postId"
}
```

### Réponses API

Les commentaires retournés incluent maintenant un objet `author` complet :

```json
{
  "_id": "commentId",
  "content": "Contenu du commentaire",
  "authorId": "userId",
  "author": {
    "_id": "userId",
    "username": "username",
    "email": "user@example.com",
    "bio": "Bio de l'utilisateur",
    "profilePictureUrl": "url_image"
  },
  "postId": "postId",
  "likes": ["userId1", "userId2"],
  "createdAt": "2023-...",
  "updatedAt": "2023-..."
}
```

### Migration des données

⚠️ **Important** : Cette migration nécessite une migration de base de données pour convertir les données existantes :

1. Les commentaires existants avec `authorEmail`/`authorUsername` doivent être mis à jour
2. Trouver l'`_id` de l'utilisateur correspondant à chaque `authorEmail`
3. Remplacer `authorEmail`/`authorUsername` par `authorId`

### Nouvelles fonctionnalités

- **Like de commentaires** : Les utilisateurs peuvent maintenant liker/unliker les commentaires
- **Authentification JWT** : Toutes les actions de création/modification nécessitent une authentification
- **Informations d'auteur enrichies** : Récupération automatique des informations complètes de l'auteur 