# Custom Error Reporter - VineJS

## 🎯 Problème Résolu

Par défaut, VineJS renvoie des erreurs **422 Unprocessable Entity** pour toutes les validations échouées, y compris les validations `exists()` sur les paramètres d'URL. Cependant, dans une API REST, lorsqu'une ressource n'existe pas (par exemple un ID dans l'URL), la réponse appropriée est **404 Not Found**.

## 🛠 Solution Implémentée

### CustomErrorReporter

Création d'un error reporter personnalisé qui :
- **404** pour les validations `exists` sur les **paramètres d'URL** (`params.*`)
- **422** pour les validations `exists` sur les **données du body**
- **422** pour toutes les autres validations

### Logique de Différenciation

```typescript
if (rule === 'exists' && field.wildCardPath.includes('params.')) {
  status = 404  // Ressource non trouvée
} else {
  status = 422  // Erreur de validation
}
```

## 📁 Fichiers Modifiés

### 1. `/app/validators/custom_error_reporter.ts`
- Implémentation du `CustomErrorReporter`
- Logique de priorité : 404 > 422

### 2. `/app/validators/game.ts`
- `gameParamsValidator` → 404 pour ID inexistant
- `gameSlugParamsValidator` → 404 pour slug inexistant
- `updateGameValidator` → 404 pour ID inexistant dans params

### 3. `/app/validators/youtube_video.ts`
- `youtubeVideoParamsValidator` → 404 pour ID inexistant
- `updateYoutubeVideoValidator` → 404 pour ID inexistant dans params

## 🧪 Tests Mis à Jour

### Nouveaux Tests
- `/tests/functional/custom_error_reporter.spec.ts` - Tests complets du comportement
- `/tests/unit/validators/custom_error_reporter.spec.ts` - Tests unitaires

### Tests Modifiés
- `/tests/functional/games_validation.spec.ts` - PUT/DELETE avec ID inexistant : 422 → 404
- `/tests/functional/youtube_videos_validation.spec.ts` - PUT/DELETE avec ID inexistant : 422 → 404

## 🔄 Exemples de Comportement

### Avant (toutes 422)
```http
GET /api/games/inexistant-slug → 422
PUT /api/admin/games/999999 → 422
DELETE /api/admin/games/999999 → 422
POST /api/admin/games {"genreIds": [999999]} → 422
```

### Après (différenciation logique)
```http
GET /api/games/inexistant-slug → 404 (ressource non trouvée)
PUT /api/admin/games/999999 → 404 (ressource non trouvée)
DELETE /api/admin/games/999999 → 404 (ressource non trouvée)
POST /api/admin/games {"genreIds": [999999]} → 422 (validation des données)
```

## 📊 Logique de Priorité

Quand plusieurs erreurs existent simultanément :

1. **404** est prioritaire si des paramètres d'URL sont invalides
2. **422** sinon pour les erreurs de validation des données

### Exemple Complexe
```http
PUT /api/admin/games/999999
{
  "name": "X",           // Trop court (422)
  "genreIds": [999999]   // Genre inexistant (422)
}
```
→ **Résultat : 404** (car l'ID 999999 du jeu n'existe pas dans l'URL)

## 🚀 Usage

Les validators utilisant ce error reporter sont automatiquement configurés :
```typescript
const validator = vine.compile(schema)
validator.errorReporter = () => new CustomErrorReporter()
```

## ✅ Avantages

1. **RESTful** : Respect des conventions HTTP
2. **Clarté** : Distinction nette ressource inexistante vs données invalides
3. **Compatibilité** : Fonctionne avec l'écosystème AdonisJS existant
4. **Extensible** : Facile d'ajouter d'autres logiques de statut

## 🔧 Maintenance

Pour ajouter d'autres validators avec ce comportement :
```typescript
const myValidator = vine.compile(mySchema)
myValidator.errorReporter = () => new CustomErrorReporter()
```