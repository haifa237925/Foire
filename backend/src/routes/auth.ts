import express from 'express';
import { 
  register, 
  login, 
  logout, 
  getMe, 
  updateDetails, 
  updatePassword, 
  forgotPassword, 
  resetPassword 
} from '../controllers/auth';
import { protect } from '../middlewares/auth';
import {
  validate,
  registerValidation,
  loginValidation,
  updateDetailsValidation,
  updatePasswordValidation,
  forgotPasswordValidation,
  resetPasswordValidation
} from '../middlewares/validator';

const router = express.Router();

// Routes publiques
router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);
router.post('/forgotpassword', validate(forgotPasswordValidation), forgotPassword);
router.put('/resetpassword/:resettoken', validate(resetPasswordValidation), resetPassword);

// Routes protégées
router.get('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, validate(updateDetailsValidation), updateDetails);
router.put('/updatepassword', protect, validate(updatePasswordValidation), updatePassword);

export default router;
