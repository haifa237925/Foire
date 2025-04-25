const jwt = require('jsonwebtoken');
const { User } = require('../models/userModel');

// Middleware pour protéger les routes
const protect = async (req, res, next) => {
  let token;

  // Vérifier si le token est présent dans les headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Récupérer le token
      token = req.headers.authorization.split(' ')[1];

      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Ajouter l'utilisateur à la requête sans le mot de passe
      req.user = await User.findById(decoded.id).select('-motDePasse');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Non autorisé, token invalide');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Non autorisé, pas de token');
  }
};

// Middleware pour vérifier les rôles
const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error('Non autorisé');
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error('Accès refusé');
    }

    next();
  };
};

module.exports = { protect, checkRole };