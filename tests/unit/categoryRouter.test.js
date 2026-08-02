import test from 'node:test';
import assert from 'node:assert/strict';
import { CategoryRouter } from '../ui/CategoryRouter.js';

test('filtre les modèles par catégorie', async () => {
  const registry = {
    models: [
      { id: 'swot', category: 'self-understanding' },
      { id: 'grow', category: 'others-improvement' }
    ]
  };
  const models = await CategoryRouter.getModelsByCategory('self-understanding', registry);
  assert.deepEqual(models, [{ id: 'swot', category: 'self-understanding' }]);
});
