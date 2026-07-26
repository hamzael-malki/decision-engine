# Guide : Ajouter un modèle de décision

Ce guide explique comment ajouter un nouveau modèle de décision à la plateforme avec l'**architecture modulaire scalable** (V1-V10).

## Architecture Modulaire (Découplage Maximum)

La plateforme utilise une structure de **modules indépendants** pour anticiper les évolutions vers API REST (V6-V7) et K8s (V8-V9).

```
providers/
├── LocalProvider.js           # Routeur orchestrateur (inchangé)
├── models/                    # 🎯 Vos modèles ici
│   ├── EisenhowerModel.js
│   ├── SWOTModel.js
│   ├── EmpathyMapModel.js
│   ├── GROWModel.js
│   └── index.js              # Exports centralisés
├── contracts/
│   └── ModelInterface.js      # Interface commune (optionnel, documentation)
├── AIProvider.js
└── ProviderFactory.js
```

## 1. Structure d'un modèle

Chaque modèle est déclaré dans `data/models.json` et suit cette structure :

```json
{
  "id": "mon-modele",
  "name": "Mon modèle personnalisé",
  "version": "1.0.0",
  "category": "self-improvement",
  "tags": ["tag1", "tag2"],
  "description": "Description optionnelle du modèle",
  "fields": [
    {
      "id": "field_id",
      "label": "Libellé affiché à l'utilisateur",
      "type": "textarea",
      "required": true,
      "placeholder": "Indice optionnel"
    }
  ],
  "defaultProvider": "local"
}
```

### Explications des champs

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `id` | string | ✅ | Identifiant unique, kebab-case |
| `name` | string | ✅ | Nom affiché dans la liste |
| `version` | string | ✅ | Sémantique (ex: "1.0.0") |
| `category` | string | ✅ | Une des 4 catégories (voir ci-dessous) |
| `tags` | string[] | ⚠️ | Mots-clés pour recherche/filtrage futur |
| `description` | string | ❌ | Description longue du modèle |
| `fields` | object[] | ✅ | Champs de formulaire |
| `defaultProvider` | string | ✅ | `"local"` ou `"ai"` |

### Catégories disponibles

```json
{
  "id": "self-improvement",
  "label": "Comment m'améliorer ?"
}
{
  "id": "self-understanding",
  "label": "Comment mieux me comprendre ?"
}
{
  "id": "others-understanding",
  "label": "Apprendre à mieux comprendre les autres ?"
}
{
  "id": "others-improvement",
  "label": "Comment pousser les autres à s'améliorer ?"
}
```

### Types de champs

Les champs de formulaire acceptent les types suivants :

| Type | Description | Exemple |
|------|-------------|---------|
| `"textarea"` | Texte multi-ligne | Description libre |
| `"text"` | Texte simple | Titre, nom |
| `"email"` | Email | Contact |
| `"number"` | Nombre | Score, durée |
| `"date"` | Date | Échéance |

---

## 2. Étape par étape : Ajouter un modèle

### Étape 1 : Déclarer le modèle dans `data/models.json`

Ouvrez `data/models.json` et ajoutez votre modèle dans le tableau `models` :

```json
{
  "categories": [ /* existant */ ],
  "models": [
    /* modèles existants */
    {
      "id": "exemple-modele",
      "name": "Mon exemple",
      "version": "1.0.0",
      "category": "self-improvement",
      "tags": ["exemple"],
      "fields": [
        {
          "id": "ma_donnee",
          "label": "Décrivez votre situation",
          "type": "textarea",
          "required": true
        }
      ],
      "defaultProvider": "local"
    }
  ]
}
```

### Étape 2 : Créer le fichier du modèle

Chaque modèle est un **fichier indépendant** dans `providers/models/`.

**`providers/models/MonModeleModel.js`** (template) :

```js
/**
 * Description de votre modèle
 * Explique l'objectif et les concepts
 */
export const MonModeleModel = {
  async execute(modelConfig, userInput) {
    // 1. Valider les données critiques
    if (!userInput.champCritique || userInput.champCritique.trim().length === 0) {
      throw new Error('Le champ critique ne peut pas être vide');
    }

    // 2. Implémenter la logique métier
    const analysis = {
      // ... traitement des données
    };

    // 3. Retourner au format standardisé
    return {
      modelId: modelConfig.id,
      provider: 'local',
      summary: `Mon Modèle - Résumé de l'analyse`,
      data: analysis
    };
  }
};
```

### Étape 3 : Exporter le modèle

Ajoutez le modèle dans `providers/models/index.js` :

```js
export { EisenhowerModel } from './EisenhowerModel.js';
export { MonModeleModel } from './MonModeleModel.js';  // ← Ligne à ajouter
```

### Étape 4 : Enregistrer le modèle dans LocalProvider

Modifiez `providers/LocalProvider.js` pour ajouter 1 ligne :

```js
import * as Models from './models/index.js';

const LOCAL_MODELS = {
  'eisenhower': Models.EisenhowerModel,
  'mon-modele': Models.MonModeleModel,  // ← Ligne à ajouter
};
```

### Étape 5 : Déclarer le modèle dans le registre

Ajoutez votre modèle dans `data/models.json` (section `models`) :

```json
{
  "id": "mon-modele",
  "name": "Mon Modèle",
  "version": "1.0.0",
  "category": "self-improvement",
  "tags": ["exemple"],
  "fields": [
    {
      "id": "mon_champ",
      "label": "Description",
      "type": "textarea",
      "required": true
    }
  ],
  "defaultProvider": "local"
}
```

---

## 2. Exemple Complet : Refactorisation Modèle GROW

Voici comment implémenter la Matrice d'Eisenhower qui catégorise les tâches selon urgence/importance.

#### 2.1 Structure du Modèle GROW

**`providers/models/GROWModel.js`** :

Le fichier existe et est complètement indépendant. Voici la structure clé :

```js
export const GROWModel = {
  async execute(modelConfig, userInput) {
    // Validation
    if (!userInput.objectif?.trim()) {
      throw new Error('Veuillez définir votre objectif');
    }

    // Logique métier
    const objectiveType = identifyObjectiveType(userInput.objectif);
    const coachingQuestions = generateCoachingQuestions(objectiveType);
    const suggestions = generateActionSuggestions(objectiveType);

    // Retour standardisé
    return {
      modelId: modelConfig.id,
      provider: 'local',
      summary: `Modèle GROW - Coaching pour ${objectiveType}`,
      data: { /* résultats */ }
    };
  }
};
```

### 2.2 Enregistrement du Modèle

Le modèle est déjà enregistré dans `data/models.json` :

```json
{
  "id": "grow",
  "name": "Modèle GROW",
  "version": "1.0.0",
  "category": "others-improvement",
  "tags": ["coaching", "feedback"],
  "fields": [
    {
      "id": "objectif",
      "label": "Objectif de progression",
      "type": "textarea",
      "required": true
    }
  ],
  "defaultProvider": "local"
}
```

### 2.3 Import dans LocalProvider

**`providers/LocalProvider.js`** importe automatiquement :

```js
import * as Models from './models/index.js';

const LOCAL_MODELS = {
  'grow': Models.GROWModel,  // ← Clé + implémentation
  // ...
};
```

Le routeur dispatche automatiquement vers `GROWModel.execute()`.

---

## 3. Avantages de l'Architecture Modulaire

| Avantage | Bénéfice |
|----------|----------|
| **Fichiers indépendants** | Chaque modèle = 1 fichier testable isolément |
| **Découplage** | Modifier un modèle n'affecte pas les autres |
| **Testabilité** | `npm test providers/models/GROWModel.js` = possible |
| **Scalabilité V6-V7** | Copier `providers/models/` directement dans backend Node.js |
| **Scalabilité V8-V9** | Chaque modèle = pod/service Kubernetes |
| **Extensibilité** | Ajouter modèle = créer 1 fichier + 1 ligne index.js |
| **Maintenabilité** | Logique métier = claire et concentrée par domaine |

---

## 4. Validation et schéma

### 5.1 Vérifier la déclaration

1. Ouvrez `http://127.0.0.1:8765/` (voir `README.md` pour lancer le serveur)
2. Votre nouveau modèle doit apparaître dans la catégorie sélectionnée
3. Les champs du formulaire doivent s'afficher correctement

### 5.2 Tester la logique

1. Remplissez le formulaire avec des données de test
2. Cliquez sur "Exécuter l'analyse"
3. Vérifiez que le résultat JSON est celui attendu

### 5.3 Tests unitaires (optionnel)

Créez un test dans `tests/` :

```js
// tests/exemple-modele.test.js
import { LocalProvider } from '../providers/LocalProvider.js';

const testModel = {
  id: 'exemple-modele',
  name: 'Mon exemple',
  fields: [{ id: 'ma_donnee', required: true }]
};

const testInput = {
  ma_donnee: 'données de test'
};

try {
  const result = await LocalProvider.execute(testModel, testInput);
  console.assert(result.modelId === 'exemple-modele', 'ID incorrect');
  console.assert(result.data.processed === 'DONNÉES DE TEST', 'Traitement incorrect');
  console.log('✅ Tous les tests passent');
} catch (error) {
  console.error('❌ Erreur:', error.message);
}
```

Lancez avec :
```powershell
npm test
```

---

## 6. Bonnes pratiques

✅ **À faire** :
- Utiliser des IDs uniques en kebab-case
- Valider/trimmer les entrées utilisateur
- Traiter les listes multi-lignes correctement
- Retourner une structure claire et documentée
- Ajouter des `recommendations` ou `next_steps` dans le résultat

❌ **À éviter** :
- Appels API synchrones dans le provider
- Modifier les champs du modèle après déclaration
- Ignorer les erreurs de validation
- Retourner des données brutes sans traitement

---

## 7. Exemple avancé : Provider AI

Pour utiliser l'AIProvider, modifiez `defaultProvider` à `"ai"` dans votre modèle, puis implémentez dans `providers/AIProvider.js` :

```js
async function executeExempleAI(modelConfig, userInput) {
  const prompt = `Analysez ceci selon mon modèle: ${JSON.stringify(userInput)}`;
  const response = await fetch('/api/ai/analyze', {
    method: 'POST',
    body: JSON.stringify({ modelId: modelConfig.id, prompt })
  });
  return await response.json();
}
```

(À implémenter selon votre infrastructure d'IA)

---

## Checklist avant commit

- [ ] Modèle déclaré dans `data/models.json`
- [ ] ID unique et en kebab-case
- [ ] Catégorie valide (une des 4)
- [ ] Champs avec `id`, `label`, `type`, `required`
- [ ] Logique implémentée dans `LocalProvider.js` (ou fichier dédié)
- [ ] Modèle apparaît dans l'UI
- [ ] Formulaire se remplit correctement
- [ ] Résultat s'affiche après soumission
- [ ] Tests (optionnel mais recommandé)

---

## Support

Pour toute question :
- Consultez le schéma : `data/model.schema.json`
- Examinez les modèles existants dans `data/models.json`
- Vérifiez les logs du navigateur (F12) pour les erreurs de validation
