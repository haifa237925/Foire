const mongoose = require('mongoose');

// Schéma de base pour tous les livres
const livreSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise']
  },
  prix: {
    type: Number,
    required: [true, 'Le prix est requis'],
    default: 0
  },
  datePublication: {
    type: Date,
    default: Date.now
  },
  estPublie: {
    type: Boolean,
    default: false
  },
  popularite: {
    type: Number,
    default: 0
  },
  noteUtilisateurs: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  nombreAvis: {
    type: Number,
    default: 0
  },
  estGratuit: {
    type: Boolean,
    default: false
  },
  auteurs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auteur',
    required: true
  }],
  editeur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  langue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Langue',
    required: true
  },
  typeLivre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TypeLivre',
    required: true
  },
  categoriesNiveau1: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CategorieNiveau1',
    required: true
  }],
  categoriesNiveau2: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CategorieNiveau2'
  }],
  themes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theme'
  }],
  publicCible: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PublicCible',
    required: true
  },
  niveauLecture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NiveauLecture',
    required: true
  },
  couverture: {
    type: String,
    default: '/images/covers/default.jpg'
  },
  type: {
    type: String,
    enum: ['numerique', 'audio'],
    required: true
  }
}, {
  timestamps: true,
  discriminatorKey: 'type',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals pour les commentaires et avis
livreSchema.virtual('commentaires', {
  ref: 'Commentaire',
  localField: '_id',
  foreignField: 'livre'
});

livreSchema.virtual('avis', {
  ref: 'Avis',
  localField: '_id',
  foreignField: 'livre'
});

// Méthode pour calculer la note moyenne
livreSchema.methods.calculerNoteMoyenne = async function() {
  const avis = await mongoose.model('Avis').find({ livre: this._id });
  if (avis.length === 0) {
    this.noteUtilisateurs = 0;
    this.nombreAvis = 0;
  } else {
    const sommeNotes = avis.reduce((acc, curr) => acc + curr.note, 0);
    this.noteUtilisateurs = sommeNotes / avis.length;
    this.nombreAvis = avis.length;
  }
  await this.save();
  return this.noteUtilisateurs;
};

const Livre = mongoose.model('Livre', livreSchema);

// Discriminateurs pour chaque type de livre
const LivreNumerique = Livre.discriminator('numerique', new mongoose.Schema({
  formatFichier: {
    type: String,
    enum: ['PDF', 'EPUB', 'MOBI', 'HTML'],
    required: true
  },
  fichier: {
    type: String,
    required: true
  }
}));

const LivreAudio = Livre.discriminator('audio', new mongoose.Schema({
  dureeMinutes: {
    type: Number,
    required: true
  },
  narrateur: {
    type: String,
    required: true
  },
  fichierAudio: {
    type: String,
    required: true
  }
}));

module.exports = {
  Livre,
  LivreNumerique,
  LivreAudio
};