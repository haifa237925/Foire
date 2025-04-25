const express = require('express');
const router = express.Router();
const { 
  getLivres,
  getLivreById,
  createLivre,
  updateLivre,
  deleteLivre,
  togglePublicationStatus,
  getLivresByEditeur,
  getLivresPopulaires,
  incrementerPopularite
} = require('../controllers/livreController');
const { protect, checkRole } = require('../middleware/authMiddleware');

// Routes publiques
router.get('/', getLivres);
router.get('/populaires', getLivresPopulaires);
router.get('/:id', getLivreById);
router.put('/:id/popularite', incrementerPopularite);

// Routes privées pour tous les utilisateurs authentifiés
router.get('/editeur/mes-livres', protect, getLivresByEditeur);

// Routes pour les écrivains et publicateurs
router.post(
  '/',
  protect,
  checkRole('ecrivain', 'publicateur'),
  createLivre
);

router.put(
  '/:id',
  protect,
  checkRole('ecrivain', 'publicateur', 'admin'),
  updateLivre
);

router.delete(
  '/:id',
  protect,
  checkRole('ecrivain', 'publicateur', 'admin'),
  deleteLivre
);

// Routes pour les administrateurs
router.put(
  '/:id/publication',
  protect,
  checkRole('admin'),
  togglePublicationStatus
);

module.exports = router;