/**
 * Analyse SWOT Personnelle
 * Évalue les Forces, Faiblesses, Opportunités et Menaces.
 *
 * Quadrants:
 * - Forces: Avantages internes positifs
 * - Faiblesses: Limitations internes
 * - Opportunités: Potentiels externes à exploiter
 * - Menaces: Risques externes à gérer
 */
export const SWOTModel = {
  async execute(modelConfig, userInput) {
    const swot = {
      strengths: userInput.forces || '',
      weaknesses: userInput.faiblesses || '',
      opportunities: userInput.opportunites || '',
      threats: userInput.menaces || ''
    };

    // Validation
    if (!Object.values(swot).some(v => v.trim())) {
      throw new Error('Au moins une section SWOT doit être remplie');
    }

    // Parser et nettoyer les listes (si plusieurs lignes)
    const parseItems = (text) => {
      return text
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    };

    const analysis = {
      strengths: parseItems(swot.strengths),
      weaknesses: parseItems(swot.weaknesses),
      opportunities: parseItems(swot.opportunities),
      threats: parseItems(swot.threats)
    };

    // Compter les éléments
    const counts = {
      strengths: analysis.strengths.length,
      weaknesses: analysis.weaknesses.length,
      opportunities: analysis.opportunities.length,
      threats: analysis.threats.length
    };

    // Identifier le quadrant dominant
    const dominantQuadrant = Object.keys(counts).reduce((a, b) =>
      counts[a] > counts[b] ? a : b
    );

    // Matrice d'actions croisées (stratégies)
    const strategies = {
      SO: 'Stratégies Offensives: Utiliser forces + opportunités',
      WO: 'Stratégies de Développement: Réduire faiblesses pour saisir opportunités',
      ST: 'Stratégies Défensives: Utiliser forces pour contrer menaces',
      WT: 'Stratégies de Survie: Minimiser faiblesses et menaces'
    };

    return {
      modelId: modelConfig.id,
      provider: 'local',
      summary: `Analyse SWOT - ${counts.strengths} forces, ${counts.weaknesses} faiblesses, ${counts.opportunities} opportunités, ${counts.threats} menaces`,
      resultType: 'matrix',
      presentation: {
        title: 'SWOT Analysis',
        icon: '📊',
        blocks: [
          { type: 'kpi', label: 'Forces', value: counts.strengths },
          { type: 'kpi', label: 'Faiblesses', value: counts.weaknesses },
          { type: 'kpi', label: 'Opportunités', value: counts.opportunities },
          { type: 'kpi', label: 'Menaces', value: counts.threats },
          { type: 'list', label: 'Stratégies', value: Object.entries(strategies).map(([k,v])=>`${k}: ${v}`) }
        ]
      },
      data: {
        counts,
        analysis,
        dominantQuadrant,
        strategies,
        recommendations: {
          focus: `Vos ${dominantQuadrant} dominent. Équilibrez les 4 quadrants pour vision complète.`,
          next_steps: [
            'Prioriser les 3 forces principales à maximiser',
            'Identifier les 2 faiblesses critiques à résoudre',
            'Évaluer les 3 opportunités les plus accessibles',
            'Élaborer un plan de mitigation pour les 2 menaces majeures'
          ]
        }
      }
    };
  }
};
