const express = require('express');
const router = express.Router();
const { 
  authUser, 
  registerUser, 
  getUserProfile, 
  updateUserProfile 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Routes publiques
router.post('/', registerUser);
router.post('/login', authUser);

// Routes protégées
router.route('/profil')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;