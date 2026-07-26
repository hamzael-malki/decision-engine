import { LocalStorage } from './LocalStorage.js';
export const StorageManager = {
  driver: LocalStorage,
  save(key, value) { return this.driver.save(key, value); },
  load(key) { return this.driver.load(key); },
  remove(key) { return this.driver.remove(key); }
};
