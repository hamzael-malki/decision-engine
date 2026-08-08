import { calculatePercentages } from '../../helpers/percentages.js';

/**
 * Matrice d'Eisenhower - Priorisation des tâches
 * Catégorise les tâches selon urgence et importance.
 *
 * Quadrants:
 * - Do First: Urgent + Important (À faire maintenant)
 * - Schedule: Pas Urgent + Important (À planifier)
 * - Delegate: Urgent + Pas Important (À déléguer)
 * - Eliminate: Pas Urgent + Pas Important (À abandonner)
 */
export const EisenhowerModel = {
  async execute(modelConfig, userInput) {
    // Parser les tâches (une par ligne)
    const tasks = userInput.taches
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    if (tasks.length === 0) {
      throw new Error('Aucune tâche à analyser');
    }

    // Classification simple basée sur mots-clés
    const matrix = {
      do_first: [],
      schedule: [],
      delegate: [],
      eliminate: []
    };

    tasks.forEach(task => {
      const taskLower = task.toLowerCase();
      const isUrgent = /urgent|asap|aujourd'hui|maintenant|critical|emergency/i.test(taskLower);
      const isImportant = /important|stratégique|priorité|core|essential|vital/i.test(taskLower);

      if (isUrgent && isImportant) {
        matrix.do_first.push(task);
      } else if (!isUrgent && isImportant) {
        matrix.schedule.push(task);
      } else if (isUrgent && !isImportant) {
        matrix.delegate.push(task);
      } else {
        matrix.eliminate.push(task);
      }
    });

    // Calcul des statistiques (garantit un total de 100%)
    const total = tasks.length;
    const distribution = calculatePercentages({
      do_first: matrix.do_first.length,
      schedule: matrix.schedule.length,
      delegate: matrix.delegate.length,
      eliminate: matrix.eliminate.length
    });


    return {
      modelId: modelConfig.id,
      provider: 'local',
      summary: `Matrice d'Eisenhower - ${total} tâches analysées (${distribution.do_first_pct}% à faire d'urgence)`,
      resultType: 'matrix',
      presentation: {
        title: 'Matrice d\'Eisenhower',
        icon: '⚡',
        blocks: [
          { type: 'kpi', label: 'Total tâches', value: total },
          { type: 'distribution', label: 'Répartition', value: distribution },
          { type: 'list', label: 'Recommandations', value: [
            `Do First: ${matrix.do_first.length} tâches`,
            `Schedule: ${matrix.schedule.length} tâches`,
            `Delegate: ${matrix.delegate.length} tâches`,
            `Eliminate: ${matrix.eliminate.length} tâches`
          ] }
        ]
      },
      data: {
        totalTasks: total,
        matrix,
        distribution,
        recommendations: {
          do_first: 'À faire maintenant - ce sont vos vraies priorités stratégiques',
          schedule: 'À planifier - important mais non urgent, bloquez du temps',
          delegate: 'À déléguer ou repousser - urgent mais peu stratégique',
          eliminate: 'À abandonner - ni urgent ni important, libère du temps'
        }
      }
    };
  }
};
