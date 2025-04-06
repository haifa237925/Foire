import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain, body } from 'express-validator';

// Middleware pour gérer les erreurs de validation
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Exécuter toutes les validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Vérifier s'il y a des erreurs
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Retourner les erreurs
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  };
};

// Règles de validation pour l'inscription
export const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Veuillez fournir un email valide')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('firstName')
    .notEmpty()
    .withMessage('Le prénom est requis'),
  body('lastName')
    .notEmpty()
    .withMessage('Le nom est requis'),
  body('role')
    .optional()
    .isIn(['writer', 'reader', 'admin'])
    .withMessage('Le rôle doit être writer, reader ou admin')
];

// Règles de validation pour la connexion
export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Veuillez fournir un email valide')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Le mot de passe est requis')
];

// Règles de validation pour la mise à jour des détails
export const updateDetailsValidation = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Veuillez fournir un email valide')
    .normalizeEmail(),
  body('firstName')
    .optional()
    .notEmpty()
    .withMessage('Le prénom ne peut pas être vide'),
  body('lastName')
    .optional()
    .notEmpty()
    .withMessage('Le nom ne peut pas être vide')
];

// Règles de validation pour la mise à jour du mot de passe
export const updatePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Le mot de passe actuel est requis'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères')
];

// Règles de validation pour le mot de passe oublié
export const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .withMessage('Veuillez fournir un email valide')
    .normalizeEmail()
];

// Règles de validation pour la réinitialisation du mot de passe
export const resetPasswordValidation = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères')
];
