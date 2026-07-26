export const config = Object.freeze({
  providers: { default: 'local', ai: { endpoint: '', apiKey: '' } },
  analytics: { driver: 'console', measurementId: '' },
  storage: { driver: 'localStorage', namespace: 'decision-engine' }
});
