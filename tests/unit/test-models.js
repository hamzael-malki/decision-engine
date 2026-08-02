/**
 * Test des modèles d'architecture modulaire
 * Vérifie que chaque modèle fonctionne correctement en isolation
 */

import { EisenhowerModel } from './providers/models/EisenhowerModel.js';
import { SWOTModel } from './providers/models/SWOTModel.js';
import { EmpathyMapModel } from './providers/models/EmpathyMapModel.js';
import { GROWModel } from './providers/models/GROWModel.js';

// Test data
const tests = [
  {
    name: 'Eisenhower Model',
    model: EisenhowerModel,
    config: {
      id: 'eisenhower',
      name: 'Matrice d\'Eisenhower',
      fields: []
    },
    input: {
      taches: `Répondre emails urgent
Stratégie annuelle important
Café ami pas urgent pas important
Appel client urgent pas important`
    }
  },
  {
    name: 'SWOT Model',
    model: SWOTModel,
    config: {
      id: 'swot',
      name: 'Analyse SWOT',
      fields: []
    },
    input: {
      forces: 'Leadership technique\nExpérience équipe',
      faiblesses: 'Resources limitées\nMarché nouveau',
      opportunites: 'Cloud growth\nPartnerships',
      menaces: 'Concurrence accrue\nRegulation change'
    }
  },
  {
    name: 'Empathy Map',
    model: EmpathyMapModel,
    config: {
      id: 'empathy-map',
      name: 'Carte d\'empathie',
      fields: []
    },
    input: {
      personne: 'Manager stressé par changements organisationnels, veut clarté et support, frustré par manque communication'
    }
  },
  {
    name: 'GROW Model',
    model: GROWModel,
    config: {
      id: 'grow',
      name: 'Modèle GROW',
      fields: []
    },
    input: {
      objectif: 'Améliorer mon leadership et confiance en tant que manager'
    }
  }
];

// Run tests
async function runTests() {
  console.log('\n🧪 TESTS DES MODÈLES (Architecture Modulaire)\n');
  console.log('='.repeat(60));

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`\n📌 Test: ${test.name}`);
      const result = await test.model.execute(test.config, test.input);

      // Validate result structure
      if (!result.modelId || !result.provider || !result.summary || !result.data) {
        throw new Error('Résultat mal structuré: manquent modelId, provider, summary, ou data');
      }

      console.log(`   ✅ Modèle exécuté avec succès`);
      console.log(`   📊 Summary: ${result.summary}`);
      console.log(`   📦 Data keys: ${Object.keys(result.data).join(', ')}`);

      passed++;
    } catch (error) {
      console.log(`   ❌ ERREUR: ${error.message}`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n📈 RÉSULTATS: ${passed} ✅ passé, ${failed} ❌ échoué\n`);

  if (failed === 0) {
    console.log('🎉 TOUS LES TESTS SONT PASSÉS! L\'architecture modulaire fonctionne parfaitement.');
  }
}

runTests();
