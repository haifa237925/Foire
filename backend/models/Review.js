const mongoose = require('mongoose');

// Schéma pour les commentaires (sans note)
const commentaireSchema = new mongoose.Schema({
  contenu: {
    type: String,
    required: [true, 'Le contenu du commentaire est requis'],
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  livre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Livre',
    required: true
  }
}, {
  timestamps: true
});

// Schéma pour les avis (avec note)
const avisSchema = new mongoose.Schema({
  note: {
    type: Number,
    required: [true, 'La note est requise'],
    min: 1,
    max: 5
  },
  date: {
    type: Date,
    default: Date.now
  },
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  livre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Livre',
    required: true
  }
}, {
  timestamps: true
});

// Garantir qu'un utilisateur ne peut donner qu'un seul avis par livre
avisSchema.index({ utilisateur: 1, livre: 1 }, { unique: true });

// Après création ou mise à jour d'un avis, recalculer la note moyenne du livre
avisSchema.post('save', async function() {
  const Livre = mongoose.model('Livre');
  const livre = await Livre.findById(this.livre);
  if (livre) {
    await livre.calculerNoteMoyenne();
  }
});

avisSchema.post('remove', async function() {
  const Livre = mongoose.model('Livre');
  const livre = await Livre.findById(this.livre);
  if (livre) {
    await livre.calculerNoteMoyenne();
  }
});

const Commentaire = mongoose.model('Commentaire', commentaireSchema);
const Avis = mongoose.model('Avis', avisSchema);

module.exports = {
  Commentaire,
  Avis
};