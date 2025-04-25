const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schéma de base pour tous les utilisateurs
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    trim: true,
    lowercase: true
  },
  motDePasse: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: 6
  },
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
  estActif: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['lecteur', 'ecrivain', 'admin', 'publicateur'],
    default: 'lecteur'
  },
  dateCreation: {
    type: Date,
    default: Date.now
  },
  // Champs spécifiques pour les écrivains
  biographie: String,
  coordonneesBancaires: String,
  // Champs spécifiques pour les lecteurs
  favoris: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Livre'
  }],
  // Champs spécifiques pour les publicateurs institutionnels
  nomInstitution: String,
  typeInstitution: String
}, {
  timestamps: true,
  discriminatorKey: 'role'
});

// Méthode pour comparer les mots de passe
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.motDePasse);
};

// Hashage du mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('motDePasse')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
});

const User = mongoose.model('User', userSchema);

// Discriminateurs pour chaque type d'utilisateur
const Lecteur = User.discriminator('lecteur', new mongoose.Schema({}));
const Ecrivain = User.discriminator('ecrivain', new mongoose.Schema({
  biographie: {
    type: String,
    default: ''
  },
  coordonneesBancaires: {
    type: String,
    default: ''
  }
}));
const Admin = User.discriminator('admin', new mongoose.Schema({}));
const Publicateur = User.discriminator('publicateur', new mongoose.Schema({
  nomInstitution: {
    type: String,
    required: [true, 'Le nom de l\'institution est requis']
  },
  typeInstitution: {
    type: String,
    required: [true, 'Le type d\'institution est requis']
  }
}));

module.exports = {
  User,
  Lecteur,
  Ecrivain,
  Admin,
  Publicateur
};