import { validator } from '../core/validator.js';
import * as Models from './models/index.js';

/**
 * LocalProvider - Routeur d'exécution pour modèles locaux
 * Valide et dispatche l'exécution vers le modèle approprié.
 *
 * Architecture modulaire: Chaque modèle (EisenhowerModel, etc.) est indépendant et testable.
 * Prêt pour migration API REST (V6-V7) : chaque modèle peut devenir un endpoint HTTP.
 */
const LOCAL_MODELS = {
  'eisenhower': Models.EisenhowerModel,
  'swot': Models.SWOTModel,
  'empathy-map': Models.EmpathyMapModel,
  'grow': Models.GROWModel,
  'bcg': Models.BCGModel
};

export const LocalProvider = {
  /**
   * Exécute un modèle local en dispatchant vers l'implémentation appropriée.
   *
   * @param {object} modelConfig - Configuration du modèle (de models.json)
   * @param {object} userInput - Données saisies par l'utilisateur
   * @returns {Promise<object>} Résultat de l'analyse
   * @throws {Error} Si le modèle n'existe pas ou validation échoue
   */
  async execute(modelConfig, userInput) {
    // Validation des données d'entrée selon le schéma du modèle
    validator.validateInput(modelConfig, userInput);

    // Récupérer l'implémentation du modèle
    const modelExecutor = LOCAL_MODELS[modelConfig.id];
    if (!modelExecutor) {
      throw new Error(
        `Modèle local non trouvé: "${modelConfig.id}". Modèles disponibles: ${Object.keys(LOCAL_MODELS).join(', ')}`
      );
    }

    // Dispatcher vers le modèle
    return await modelExecutor.execute(modelConfig, userInput);
  }
};
