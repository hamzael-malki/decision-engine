export const validator = {
  validateModel(model) {
    if (!model || typeof model !== 'object') throw new TypeError('Le modèle doit être un objet.');
    for (const property of ['id', 'name', 'version', 'fields', 'defaultProvider']) {
      if (!model[property]) throw new Error(`Propriété de modèle manquante : ${property}`);
    }
    if (!/^[a-z][a-z0-9-]*$/.test(model.id)) throw new Error('L’identifiant du modèle doit être en kebab-case.');
    if (!/^\d+\.\d+\.\d+$/.test(model.version)) throw new Error('La version doit respecter le format x.y.z.');
    if (!['local', 'ai'].includes(model.defaultProvider)) throw new Error('Provider par défaut non pris en charge.');
    if (!Array.isArray(model.fields) || model.fields.length === 0) throw new Error('fields doit être un tableau non vide.');
    const fieldIds = new Set();
    model.fields.forEach(field => {
      if (!field.id || !field.label || !field.type) throw new Error('Chaque champ exige id, label et type.');
      if (!/^[a-z][a-z0-9-]*$/.test(field.id)) throw new Error(`Identifiant de champ invalide : ${field.id}`);
      if (fieldIds.has(field.id)) throw new Error(`Identifiant de champ dupliqué : ${field.id}`);
      if (!['textarea', 'text', 'number', 'date'].includes(field.type)) throw new Error(`Type de champ non pris en charge : ${field.type}`);
      if (typeof field.required !== 'boolean') throw new Error(`required doit être un booléen : ${field.id}`);
      fieldIds.add(field.id);
    });
    return true;
  },
  validateRegistry(models) {
    if (!Array.isArray(models) || models.length === 0) throw new Error('Le registre doit contenir au moins un modèle.');
    const modelIds = new Set();
    models.forEach(model => {
      this.validateModel(model);
      if (modelIds.has(model.id)) throw new Error(`Identifiant de modèle dupliqué : ${model.id}`);
      modelIds.add(model.id);
    });
    return true;
  },
  validateInput(model, input) {
    this.validateModel(model);
    model.fields.filter(field => field.required).forEach(field => {
      if (!String(input?.[field.id] ?? '').trim()) throw new Error(`Champ requis : ${field.label}`);
    });
    return true;
  }
};
