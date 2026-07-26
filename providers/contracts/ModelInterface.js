/**
 * Interface standard pour tous les modèles de décision.
 * Chaque modèle doit respecter ce contrat pour assurer :
 * - Découplage : modèles indépendants de l'UI et du provider
 * - Testabilité : chaque modèle testable isolément
 * - Scalabilité : préparé pour migration API REST (V6-V7) et K8s (V8-V9)
 *
 * @interface ModelInterface
 */
export const ModelInterface = {
  /**
   * Exécute la logique métier du modèle.
   *
   * @param {object} modelConfig - Configuration du modèle (depuis models.json)
   *   - id: string (ex: "eisenhower")
   *   - name: string (ex: "Matrice d'Eisenhower")
   *   - fields: array (définition des champs du formulaire)
   *
   * @param {object} userInput - Données saisies par l'utilisateur
   *   - Clés = field.id, valeurs = données saisies
   *
   * @returns {Promise<object>} Résultat standardisé
   *   {
   *     modelId: string,
   *     provider: "local" | "ai" | "api",
   *     summary: string,
   *     data: object (analyse spécifique au modèle)
   *   }
   *
   * @throws {Error} Si validation ou exécution échoue
   */
  async execute(modelConfig, userInput) {
    throw new Error('execute() must be implemented by concrete model');
  }
};
