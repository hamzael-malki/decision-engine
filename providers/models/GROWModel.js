/**
 * Modèle GROW - Coaching et Développement
 * Structure un objectif de progression autour de 4 piliers.
 *
 * Piliers:
 * - Goal: Définir l'objectif clairement
 * - Reality: Évaluer la situation actuelle
 * - Options: Explorer les chemins possibles
 * - Will: Engager et planifier les actions
 */
export const GROWModel = {
  async execute(modelConfig, userInput) {
    const objective = userInput.objectif?.trim();

    if (!objective || objective.length === 0) {
      throw new Error('Veuillez définir votre objectif de progression');
    }

    // Structure du modèle GROW
    const grow = {
      goal: objective,
      reality: 'Situation actuelle et contexte:',
      options: 'Chemins et stratégies possibles:',
      will: 'Engagement et plan d\'action:'
    };

    // Analyse du texte pour suggestions
    const textLower = objective.toLowerCase();

    // Identifier le type d'objectif
    let objectiveType = 'Générique';
    if (/apprendre|compétence|skill|formation/i.test(textLower)) {
      objectiveType = 'Développement de compétence';
    } else if (/leadership|manager|équipe|délégation/i.test(textLower)) {
      objectiveType = 'Leadership & Management';
    } else if (/performance|productivité|efficacité/i.test(textLower)) {
      objectiveType = 'Performance';
    } else if (/communication|relation|collaboration/i.test(textLower)) {
      objectiveType = 'Communication & Relations';
    } else if (/confiance|estime|bien-être/i.test(textLower)) {
      objectiveType = 'Bien-être & Confiance';
    }

    // Questions de coaching suggérées
    const coachingQuestions = {
      goal: [
        'Pourquoi cet objectif est-il important pour vous?',
        'Quel sera l\'impact positif de l\'atteinte de cet objectif?',
        'Quelle sera votre situation quand vous l\'aurez atteint?'
      ],
      reality: [
        'Où en êtes-vous actuellement sur le chemin de cet objectif?',
        'Quels progrès avez-vous déjà faits?',
        'Quels obstacles ou défis se dressent sur votre route?',
        'Qui peut vous aider ou vous soutenir?'
      ],
      options: [
        'Quelles approches différentes pouviez-vous explorer?',
        'Qui a déjà réussi quelque chose de similaire?',
        'Que feriez-vous si vous aviez accès à des ressources illimitées?',
        'Quelles sont vos 3 meilleures options?'
      ],
      will: [
        'Quel est votre première étape concrète?',
        'Quand allez-vous la faire?',
        'Comment allez-vous vous tenir accountable?',
        'Quel soutien ou ressource avez-vous besoin?'
      ]
    };

    // Suggestions d'actions basées sur le type
    const actionSuggestions = {
      'Développement de compétence': [
        'Identifier les ressources d\'apprentissage (cours, mentors)',
        'Pratiquer régulièrement la compétence',
        'Chercher du feedback constructif'
      ],
      'Leadership & Management': [
        'Observer les leaders qui vous inspirent',
        'Augmenter votre écoute active',
        'Déléguer pour développer votre équipe'
      ],
      'Performance': [
        'Mesurer votre point de départ',
        'Créer un système de suivi des progrès',
        'Fêter les petites victoires'
      ],
      'Communication & Relations': [
        'Pratiquer l\'empathie au quotidien',
        'Demander du feedback honnête',
        'Investir du temps dans les relations clés'
      ],
      'Bien-être & Confiance': [
        'Identifier vos forces et les utiliser davantage',
        'Pratiquer l\'auto-compassion',
        'Chercher un mentor ou un coach'
      ],
      'Générique': [
        'Décomposer l\'objectif en étapes',
        'Identifier les ressources nécessaires',
        'Établir des jalons de suivi'
      ]
    };

    return {
      modelId: modelConfig.id,
      provider: 'local',
      summary: `Modèle GROW - Coaching pour objectif: ${objectiveType}`,
      data: {
        objectif: objective,
        objectiveType,
        grow,
        coachingQuestions,
        actionSuggestions: actionSuggestions[objectiveType] || actionSuggestions['Générique'],
        recommendations: {
          phase1: 'Clarifier l\'objectif avec les questions du pilier Goal',
          phase2: 'Évaluer la réalité avec lucidité (pilier Reality)',
          phase3: 'Brainstormer les options sans filtrage (pilier Options)',
          phase4: 'Engager et valider le plan d\'action (pilier Will)',
          frequency: 'Revisitez ce plan toutes les 2-4 semaines pour suivi'
        }
      }
    };
  }
};
