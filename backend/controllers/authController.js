const jwt = require('jsonwebtoken');
const { User, Lecteur, Ecrivain, Admin, Publicateur } = require('../models/userModel');

// Générer un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Authentifier un utilisateur
// @route   POST /api/utilisateurs/login
// @access  Public
const authUser = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(motDePasse))) {
      res.json({
        _id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        estActif: user.estActif,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Email ou mot de passe invalide');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message
    });
  }
};

// @desc    Enregistrer un nouveau lecteur
// @route   POST /api/utilisateurs
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { nom, prenom, email, motDePasse, role = 'lecteur' } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('Cet utilisateur existe déjà');
    }

    // Créer l'utilisateur en fonction du rôle
    let user;

    switch (role) {
      case 'lecteur':
        user = await Lecteur.create({
          nom,
          prenom,
          email,
          motDePasse
        });
        break;
      case 'ecrivain':
        const { biographie = '', coordonneesBancaires = '' } = req.body;
        user = await Ecrivain.create({
          nom,
          prenom,
          email,
          motDePasse,
          biographie,
          coordonneesBancaires
        });
        break;
      case 'publicateur':
        const { nomInstitution, typeInstitution } = req.body;
        
        if (!nomInstitution || !typeInstitution) {
          res.status(400);
          throw new Error('Informations manquantes pour le publicateur institutionnel');
        }
        
        user = await Publicateur.create({
          nom,
          prenom,
          email,
          motDePasse,
          nomInstitution,
          typeInstitution
        });
        break;
      case 'admin':
        // La création d'administrateurs devrait être restreinte
        res.status(403);
        throw new Error('La création d\'administrateurs n\'est pas autorisée via cette route');
      default:
        res.status(400);
        throw new Error('Rôle non valide');
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        estActif: user.estActif,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Données utilisateur invalides');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message
    });
  }
};

// @desc    Obtenir le profil de l'utilisateur
// @route   GET /api/utilisateurs/profil
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        estActif: user.estActif,
        // Ajouter d'autres champs spécifiques aux rôles si nécessaire
      });
    } else {
      res.status(404);
      throw new Error('Utilisateur non trouvé');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message
    });
  }
};

// @desc    Mettre à jour le profil utilisateur
// @route   PUT /api/utilisateurs/profil
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.nom = req.body.nom || user.nom;
      user.prenom = req.body.prenom || user.prenom;
      user.email = req.body.email || user.email;
      
      // Mettre à jour le mot de passe si fourni
      if (req.body.motDePasse) {
        user.motDePasse = req.body.motDePasse;
      }

      // Mettre à jour les champs spécifiques au rôle
      switch (user.role) {
        case 'ecrivain':
          user.biographie = req.body.biographie || user.biographie;
          user.coordonneesBancaires = req.body.coordonneesBancaires || user.coordonneesBancaires;
          break;
        case 'publicateur':
          user.nomInstitution = req.body.nomInstitution || user.nomInstitution;
          user.typeInstitution = req.body.typeInstitution || user.typeInstitution;
          break;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        nom: updatedUser.nom,
        prenom: updatedUser.prenom,
        email: updatedUser.email,
        role: updatedUser.role,
        estActif: updatedUser.estActif,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error('Utilisateur non trouvé');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message
    });
  }
};

module.exports = {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile
};