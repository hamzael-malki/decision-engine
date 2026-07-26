/**
 * Exports centralisés des modèles de décision
 * Permet à LocalProvider et autres consumers d'importer les modèles facilement.
 *
 * Utilisation:
 *   import * as Models from './models/index.js';
 *   const model = Models.EisenhowerModel;
 */

export { EisenhowerModel } from './EisenhowerModel.js';
export { SWOTModel } from './SWOTModel.js';
export { EmpathyMapModel } from './EmpathyMapModel.js';
export { GROWModel } from './GROWModel.js';
