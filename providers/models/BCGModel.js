/**
 * BCG Matrix Model
 * Input expected: userInput.items as multiline text, each line: "name | marketSharePct | growthRatePct"
 * Example line: "Product A | 25 | 30"
 */
export const BCGModel = {
  async execute(modelConfig, userInput) {
    const raw = userInput.items || '';
    const lines = raw
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    if (lines.length === 0) {
      throw new Error('Aucun élément fourni (items) pour la matrice BCG');
    }

    const parseLine = (line) => {
      // Split by '|' or ','
      const parts = line.split('|').map(p => p.trim());
      if (parts.length < 3) {
        // try comma
        const alt = line.split(',').map(p => p.trim());
        if (alt.length >= 3) return { name: alt[0], marketShare: Number(alt[1]) || 0, growth: Number(alt[2]) || 0 };
        return { name: line, marketShare: 0, growth: 0 };
      }
      return { name: parts[0], marketShare: Number(parts[1]) || 0, growth: Number(parts[2]) || 0 };
    };

    const items = lines.map(parseLine);

    // Thresholds (simple heuristic)
    const GROWTH_HIGH = 20; // %
    const MARKET_HIGH = 20; // %

    const matrix = {
      stars: [], // high growth, high market share
      question_marks: [], // high growth, low market share
      cash_cows: [], // low growth, high market share
      dogs: [] // low growth, low market share
    };

    items.forEach(it => {
      const highGrowth = it.growth >= GROWTH_HIGH;
      const highMarket = it.marketShare >= MARKET_HIGH;
      if (highGrowth && highMarket) matrix.stars.push(it);
      else if (highGrowth && !highMarket) matrix.question_marks.push(it);
      else if (!highGrowth && highMarket) matrix.cash_cows.push(it);
      else matrix.dogs.push(it);
    });

    const total = items.length;
    const counts = {
      stars: matrix.stars.length,
      question_marks: matrix.question_marks.length,
      cash_cows: matrix.cash_cows.length,
      dogs: matrix.dogs.length
    };

    const distribution = {
      stars_pct: Math.round((counts.stars / total) * 100),
      question_marks_pct: Math.round((counts.question_marks / total) * 100),
      cash_cows_pct: Math.round((counts.cash_cows / total) * 100),
      dogs_pct: Math.round((counts.dogs / total) * 100)
    };

    const recommendations = {
      stars: 'Investir pour soutenir la croissance et défendre la part de marché',
      question_marks: 'Analyser potentiel: investir sélectivement ou recentrer selon ROI',
      cash_cows: 'Extraire cash et optimiser coûts; soutenir maintien',
      dogs: 'Réduire investissement ou désinvestir, libérer ressources'
    };

    // Presentation metadata to guide renderers
    const presentation = {
      title: 'BCG Matrix',
      icon: '📦',
      blocks: [
        { type: 'kpi', label: 'Total items', value: total },
        { type: 'distribution', label: 'Répartition', value: distribution },
        { type: 'list', label: 'Top Stars', value: matrix.stars.slice(0,5).map(i=>`${i.name} (${i.marketShare}% / ${i.growth}%)`) }
      ],
      resultType: 'matrix'
    };

    return {
      modelId: modelConfig.id,
      provider: 'local',
      summary: `BCG - ${total} éléments analysés (Stars: ${counts.stars}, Cash cows: ${counts.cash_cows})`,
      resultType: 'matrix',
      presentation,
      data: {
        total,
        matrix,
        counts,
        distribution,
        recommendations,
        items
      }
    };
  }
};
