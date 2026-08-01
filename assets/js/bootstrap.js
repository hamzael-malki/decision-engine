import { init } from './ui.js';

// bootstrap the UI
init().catch(err => {
  console.error('Failed to initialize UI:', err);
  const rootError = document.createElement('div');
  rootError.style.background = '#fdecea';
  rootError.style.color = '#b42318';
  rootError.style.padding = '1rem';
  rootError.style.borderRadius = '8px';
  rootError.style.margin = '1rem';
  rootError.textContent = 'Erreur lors de l\'initialisation de l\'interface. Ouvrez la console pour détails.';
  document.body.prepend(rootError);
});
