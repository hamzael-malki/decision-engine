import { eventBus } from '../core/eventBus.js';

export const CategoryRouter = {
  async getModelsByCategory(categoryId, modelsRegistry) {
    eventBus.publish('CATEGORY_SELECTED', { categoryId });
    return modelsRegistry.models.filter(model => model.category === categoryId);
  },
  async recommendModelViaAI(userPrompt, aiProvider) {
    eventBus.publish('AI_RECOMMENDATION_REQUESTED', { userPrompt });
    return aiProvider.suggestModel(userPrompt);
  }
};
