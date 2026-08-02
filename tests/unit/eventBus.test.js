import test from 'node:test';
import assert from 'node:assert/strict';
import { eventBus } from '../core/eventBus.js';

test('publie une donnée puis désinscrit le listener', () => {
  eventBus.listeners = {};
  const received = [];
  const unsubscribe = eventBus.subscribe('TEST_EVENT', value => received.push(value));
  eventBus.publish('TEST_EVENT', { ok: true });
  unsubscribe();
  eventBus.publish('TEST_EVENT', { ok: false });
  assert.deepEqual(received, [{ ok: true }]);
});

test('un listener défaillant ne bloque pas les autres', () => {
  eventBus.listeners = {};
  let delivered = false;
  const originalError = console.error;
  console.error = () => {};
  eventBus.subscribe('TEST_EVENT', () => { throw new Error('échec contrôlé'); });
  eventBus.subscribe('TEST_EVENT', () => { delivered = true; });
  eventBus.publish('TEST_EVENT');
  console.error = originalError;
  assert.equal(delivered, true);
});
