const mongoose = require('mongoose');

// Schéma pour les catégories de niveau 1
const categorieNiveau1Schema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom de la catégorie est requis'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals pour les sous-catégories
categorieNiveau1Schema.virtual('sousCategories', {
  ref: 'CategorieNiveau2',
  localField: '_id',
  foreignField: 'categorieParent'
});

// Schéma pour les catégories de niveau 2
const categorieNiveau2Schema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom de la sous-catégorie est requis'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise']
  },
  categorieParent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CategorieNiveau1',
    required: true
  }
}, {
  timestamps: true
});

// Index composé pour garantir l'unicité du nom au sein d'une même catégorie parent
categorieNiveau2Schema.index({ nom: 1, categorieParent: 1 }, { unique: true });

// Schéma pour les langues
const langueSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Le code de la langue est requis'],
    trim: true,
    unique: true
  },
  nom: {
    type: String,
    required: [true, 'Le nom de la langue est requis'],
    trim: true,
    unique: true
  }
}, {
  timestamps: true
});

// Schéma pour les types de livre
const typeLivreSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom du type est requis'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise']
  }
}, {
  timestamps: true
});

// Schéma pour les thèmes
const themeSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom du thème est requis'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise']
  }
}, {
  timestamps: true
});

// Schéma pour les auteurs
const auteurSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  prenom: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true
  },
  biographie: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index pour les noms et prénoms des auteurs
auteurSchema.index({ nom: 1, prenom: 1 }, { unique: true });

// Schéma pour les publics cibles
const publicCibleSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Le type de public est requis'],
    trim: true,
    unique: true
  },
  trancheAge: {
    type: String,
    required: [true, 'La tranche d\'âge est requise'],
    trim: true
  }
}, {
  timestamps: true
});

// Schéma pour les niveaux de lecture
const niveauLectureSchema = new mongoose.Schema({
  niveau: {
    type: String,
    required: [true, 'Le niveau est requis'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise']
  }
}, {
  timestamps: true
});

const CategorieNiveau1 = mongoose.model('CategorieNiveau1', categorieNiveau1Schema);
const CategorieNiveau2 = mongoose.model('CategorieNiveau2', categorieNiveau2Schema);
const Langue = mongoose.model('Langue', langueSchema);
const TypeLivre = mongoose.model('TypeLivre', typeLivreSchema);
const Theme = mongoose.model('Theme', themeSchema);
const Auteur = mongoose.model('Auteur', auteurSchema);
const PublicCible = mongoose.model('PublicCible', publicCibleSchema);
const NiveauLecture = mongoose.model('NiveauLecture', niveauLectureSchema);

module.exports = {
  CategorieNiveau1,
  CategorieNiveau2,
  Langue,
  TypeLivre,
  Theme,
  Auteur,
  PublicCible,
  NiveauLecture
};