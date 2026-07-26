import test from 'node:test';
import assert from 'node:assert/strict';
import { validator } from '../core/validator.js';

const validModel = {
  id: 'swot', name: 'Analyse SWOT', version: '1.0.0', defaultProvider: 'local',
  fields: [{ id: 'forces', label: 'Forces', type: 'textarea', required: true }]
};

test('accepte un modèle conforme', () => {
  assert.equal(validator.validateRegistry([validModel]), true);
});

test('rejette les identifiants de modèles dupliqués', () => {
  assert.throws(() => validator.validateRegistry([validModel, { ...validModel }]), /dupliqué/);
});

test('rejette un champ requis manquant', () => {
  assert.throws(() => validator.validateInput(validModel, {}), /Champ requis/);
});

test('rejette un type de champ inconnu', () => {
  const invalid = { ...validModel, fields: [{ ...validModel.fields[0], type: 'email' }] };
  assert.throws(() => validator.validateModel(invalid), /non pris en charge/);
});
