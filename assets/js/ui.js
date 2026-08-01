import { engine } from '../../core/engine.js';
import { state } from '../../core/state.js';
import { eventBus } from '../../core/eventBus.js';
import { validator } from '../../core/validator.js';
import { StorageManager } from '../../storage/StorageManager.js';
import { CategoryRouter } from '../../ui/CategoryRouter.js';
import { renderResult } from '../../ui/ResultRenderer.js';

export async function init() {
  const categoryView = document.querySelector('#category-view');
  const categoryList = document.querySelector('#category-list');
  const modelView = document.querySelector('#model-view');
  const categoryTitle = document.querySelector('#category-title');
  const form = document.querySelector('#decision-form');
  const select = document.querySelector('#model-select');
  const fields = document.querySelector('#model-fields');
  const status = document.querySelector('#load-status');
  const result = document.querySelector('#result');
  const resultContent = document.querySelector('#result-content');
  const submitButton = form.querySelector('button[type="submit"]');
  let registry;
  let visibleModels = [];
  let pendingTransition = null;
  let pendingFallback = null;

  try {
    registry = await fetch('./data/models.json').then(response => {
      if (!response.ok) throw new Error('Impossible de charger le registre des modèles.');
      return response.json();
    });
    validator.validateRegistry(registry.models);
    if (!Array.isArray(registry.categories) || registry.categories.length !== 4) throw new Error('Les catégories sont invalides.');
  } catch (error) {
    categoryList.textContent = 'Les modèles ne peuvent pas être chargés. Ouvrez le projet avec un serveur local ou via GitHub Pages.';
    categoryList.className = 'error';
    throw error;
  }

  const renderFields = () => {
    const model = visibleModels.find(item => item.id === select.value);
    result.classList.add('hidden');
    if (!model) {
      state.set('currentModel', null);
      fields.replaceChildren();
      status.textContent = 'Sélectionnez votre modèle pour approfondir votre situation.';
      submitButton.disabled = true;
      return;
    }
    state.set('currentModel', model);
    status.textContent = '';
    submitButton.disabled = false;
    fields.replaceChildren(...model.fields.map(field => {
      const label = document.createElement('label');
      label.htmlFor = field.id;
      label.textContent = field.label + (field.required ? ' *' : '');
      const input = document.createElement(field.type === 'textarea' ? 'textarea' : 'input');
      input.id = input.name = field.id;
      input.required = field.required;
      if (field.type !== 'textarea') input.type = field.type;
      label.append(input);
      return label;
    }));
  };

  const selectCategory = async category => {
    visibleModels = await CategoryRouter.getModelsByCategory(category.id, registry);
    categoryTitle.textContent = category.label;
    select.replaceChildren(new Option('Sélectionnez votre modèle', ''));
    visibleModels.forEach(model => select.add(new Option(model.name, model.id)));
    // Hide categories and reveal model view, but defer heavy DOM rendering until transition ends
    categoryView.classList.add('hidden');
    modelView.classList.remove('hidden');

    // Clean previous pending listeners if any
    if (pendingTransition) { modelView.removeEventListener('transitionend', pendingTransition); clearTimeout(pendingFallback); pendingTransition = null; pendingFallback = null; }

    const onTransitionEnd = (e) => {
      if (e.propertyName !== 'opacity') return;
      // Render fields after animation completes
      renderFields();
      modelView.removeEventListener('transitionend', onTransitionEnd);
      if (pendingFallback) { clearTimeout(pendingFallback); pendingFallback = null; }
      pendingTransition = null;
    };

    pendingTransition = onTransitionEnd;
    modelView.addEventListener('transitionend', onTransitionEnd);
    // Fallback: if transitionend doesn't fire, render after 400ms
    pendingFallback = setTimeout(() => { if (pendingTransition) { renderFields(); modelView.removeEventListener('transitionend', pendingTransition); pendingTransition = null; pendingFallback = null; } }, 400);

    modelView.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  registry.categories.forEach(category => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'category-button';
    button.textContent = category.label;
    button.addEventListener('click', () => selectCategory(category));
    categoryList.append(button);
  });

  document.querySelector('#back-button').addEventListener('click', () => {
    state.set('currentModel', null);
    // Cancel pending render if user navigates back during transition
    if (pendingTransition) { modelView.removeEventListener('transitionend', pendingTransition); clearTimeout(pendingFallback); pendingTransition = null; pendingFallback = null; }
    modelView.classList.add('hidden');
    categoryView.classList.remove('hidden');
  });
  select.addEventListener('change', renderFields);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const model = visibleModels.find(item => item.id === select.value);
    const userInput = Object.fromEntries(new FormData(form));
    submitButton.disabled = true;
    try {
      const output = await engine.executeModel(model, userInput);
      resultContent.innerHTML = renderResult(output);
      resultContent.className = '';
      result.classList.remove('hidden');
    } catch (error) {
      resultContent.textContent = error.message;
      resultContent.className = 'error';
      result.classList.remove('hidden');
    } finally { submitButton.disabled = false; }
  });
  eventBus.subscribe('MODEL_FINISHED', event => StorageManager.save('lastExecution', { ...event, at: new Date().toISOString() }));
}
