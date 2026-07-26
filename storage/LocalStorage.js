import { config } from '../config.js';
const keyFor = key => `${config.storage.namespace}:${key}`;
export const LocalStorage = {
  save(key, value) { localStorage.setItem(keyFor(key), JSON.stringify(value)); return value; },
  load(key) { const value = localStorage.getItem(keyFor(key)); return value ? JSON.parse(value) : null; },
  remove(key) { localStorage.removeItem(keyFor(key)); }
};
