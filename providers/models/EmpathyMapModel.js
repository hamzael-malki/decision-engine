/**
 * Carte d'Empathie
 * Comprend la perspective, besoins, frustrations et joies d'une personne.
 *
 * Quadrants:
 * - Dit: Ce que la personne dit explicitement
 * - Pense: Ce que la personne pense vraiment
 * - Ressent: Émotions et sentiments
 * - Fait: Actions et comportements
 */
export const EmpathyMapModel = {
  async execute(modelConfig, userInput) {
    const description = userInput.personne?.trim();

    if (!description || description.length === 0) {
      throw new Error('Veuillez décrire la personne à comprendre');
    }

    // Segments de la carte d'empathie (à enrichir par heuristiques)
    const empathyMap = {
      dit: 'Ce que la personne dit à haute voix:',
      pense: 'Ce que la personne pense en privé:',
      ressent: 'Émotions principales:',
      fait: 'Actions et comportements observés:'
    };

    // Analyse simple du texte pour extraire indices
    const textLower = description.toLowerCase();

    // Heuristiques d'extraction (à améliorer avec IA en V4-V5)
    const extraitEmotions = [];
    if (/heureux|content|satisfait|optimiste/i.test(textLower)) extraitEmotions.push('Optimisme');
    if (/frustré|énervé|colère|irrité/i.test(textLower)) extraitEmotions.push('Frustration');
    if (/peur|anxieux|stress|inquiet/i.test(textLower)) extraitEmotions.push('Anxiété');
    if (/confus|perdu|incertain/i.test(textLower)) extraitEmotions.push('Confusion');
    if (/passionné|enthousiaste|motivé/i.test(textLower)) extraitEmotions.push('Motivation');

    const extraitBesoins = [];
    if (/besoin|manque|veut|désire|aspire/i.test(textLower)) extraitBesoins.push('Clarté sur ses objectifs');
    if (/aide|support|soutien|accompagnement/i.test(textLower)) extraitBesoins.push('Support et accompagnement');
    if (/reconnaissance|appréciation|valorisation/i.test(textLower)) extraitBesoins.push('Reconnaissance');
    if (/compréhension|écoute|empathie/i.test(textLower)) extraitBesoins.push('Écoute attentive');
    if (/autonomie|indépendance|liberté/i.test(textLower)) extraitBesoins.push('Autonomie');

    const extraitFrustrations = [];
    if (/problème|difficile|obstacle|bloqué/i.test(textLower)) extraitFrustrations.push('Obstacles et blocages');
    if (/incompris|ignoré|oublié/i.test(textLower)) extraitFrustrations.push('Sentir non entendu');
    if (/lenteur|attente|délai/i.test(textLower)) extraitFrustrations.push('Manque de progrès rapide');
    if (/conflit|tension|désaccord/i.test(textLower)) extraitFrustrations.push('Conflits relationnels');
    if (/échec|échec|régression/i.test(textLower)) extraitFrustrations.push('Peur de l\'échec');

    // Compléter avec placeholders si peu de données
    if (extraitEmotions.length === 0) extraitEmotions.push('À clarifier');
    if (extraitBesoins.length === 0) extraitBesoins.push('À explorer');
    if (extraitFrustrations.length === 0) extraitFrustrations.push('À identifier');

    return {
      modelId: modelConfig.id,
      provider: 'local',
      summary: `Carte d'Empathie - Analyse de ${Math.round(description.length / 10)} concepts identifiés`,
      data: {
        personDescription: description,
        empathyMap,
        emotions: extraitEmotions,
        needs: extraitBesoins,
        frustrations: extraitFrustrations,
        insights: {
          primaryEmotion: extraitEmotions[0],
          mainNeed: extraitBesoins[0],
          keyFrustration: extraitFrustrations[0]
        },
        recommendations: {
          listen: 'Écoutez activement pour confirmer vos suppositions',
          validate: 'Validez les émotions et besoins identifiés',
          empathize: 'Cherchez des points communs pour construire la confiance',
          support: 'Proposez un support aligné sur les besoins principaux'
        }
      }
    };
  }
};
