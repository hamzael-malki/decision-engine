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

    // Calcul des statistiques
    const total = tasks.length;
    const distribution = {
      do_first_pct: Math.round((matrix.do_first.length / total) * 100),
      schedule_pct: Math.round((matrix.schedule.length / total) * 100),
      delegate_pct: Math.round((matrix.delegate.length / total) * 100),
      eliminate_pct: Math.round((matrix.eliminate.length / total) * 100)
    };

    return {
      modelId: modelConfig.id,
      provider: 'local',
      summary: `Matrice d'Eisenhower - ${total} tâches analysées (${distribution.do_first_pct}% à faire d'urgence)`,
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
