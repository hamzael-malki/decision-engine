# Decision Engine Platform

MVP modulaire en HTML, CSS et JavaScript natifs. Le noyau métier ne dépend ni de l’interface, ni des drivers de stockage, d’analytique ou d’IA.

## Prérequis

- Un navigateur moderne (Chrome, Edge, Firefox ou Safari récent).
- Python 3 pour lancer le serveur local. Le projet n’utilise aucune dépendance npm.
- Node.js 20 ou supérieur est uniquement nécessaire pour exécuter les tests unitaires.

### Installer Python 3 (si nécessaire)

Téléchargez Python 3 depuis [python.org](https://www.python.org/downloads/). Sous Windows, cochez l’option **Add Python to PATH** pendant l’installation, puis fermez et rouvrez PowerShell.

Vérifiez l’installation :

```powershell
python --version
```

## Démarrage local

N’ouvrez pas `index.html` par double-clic : le protocole `file://` bloque le chargement des modules JavaScript et de `data/models.json`.

Dans PowerShell, lancez un serveur statique depuis le dossier du projet :

```powershell
cd "C:\Users\Hamza EL MALKI\Desktop\decision-engine"
python -m http.server 8765
```

Ouvrez ensuite [http://127.0.0.1:8765/](http://127.0.0.1:8765/) dans le navigateur. Gardez cette fenêtre PowerShell ouverte ; utilisez `Ctrl+C` pour arrêter le serveur.

## Tests locaux

Après avoir installé Node.js 20 ou supérieur depuis [nodejs.org](https://nodejs.org/), lancez :

```powershell
npm test
```

Cette commande utilise le moteur de test intégré à Node.js et ne télécharge aucun package.

## Architecture

- `core/` : orchestration, état, bus d’événements et validation.
- `providers/` : exécution locale ou adaptateur IA REST.
- `storage/` et `analytics/` : abstractions et drivers interchangeables.
- `ui/CategoryRouter.js` : filtre les modèles par thème et publie l’événement de sélection.
- `data/models.json` : registre déclaratif des catégories et des modèles.

## Parcours d’orientation

La page d’accueil propose les quatre axes du Livre des Décisions avant toute sélection de modèle :

- `self-improvement` - Comment m’améliorer ?
- `self-understanding` - Comment mieux me comprendre ?
- `others-understanding` - Apprendre à mieux comprendre les autres ?
- `others-improvement` - Comment pousser les autres à s’améliorer ?

Le clic sur un thème filtre localement les modèles associés, puis affiche leur liste déroulante. Le Core Engine (`core/engine.js`, `core/eventBus.js`, `core/state.js`) reste inchangé.

### Format du registre

`data/models.json` contient un objet avec deux collections :

```json
{
  "categories": [{ "id": "self-improvement", "label": "Comment m'améliorer ?" }],
  "models": [{ "id": "eisenhower", "category": "self-improvement", "defaultProvider": "local" }]
}
```

Chaque modèle doit déclarer une `category` qui correspond à l’un des identifiants de `categories`. Le schéma de référence est disponible dans `data/model.schema.json`.

## Évolution

Les couches UI, stockage, analytics et providers peuvent être remplacées sans modifier `core/` ni les contrats de modèles.

## Qualité

Le registre est validé au chargement par `core/validator.js`. Le schéma de référence est dans `data/model.schema.json`. Les tests n’ajoutent aucune dépendance : avec Node.js 20 ou supérieur, exécutez `npm test`.
