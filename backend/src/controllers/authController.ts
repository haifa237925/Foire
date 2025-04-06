import { Request, Response } from 'express';
import crypto from 'crypto';
import User, { IUser } from '../models/User';

// @desc    Inscrire un utilisateur
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Créer l'utilisateur
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: role || 'reader' // Par défaut, le rôle est 'reader'
    });

    // Envoyer la réponse avec le token
    sendTokenResponse(user, 201, res);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Erreur lors de l\'inscription'
      });
    }
  }
};

// @desc    Connecter un utilisateur
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Valider email et mot de passe
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Veuillez fournir un email et un mot de passe'
      });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Identifiants invalides'
      });
    }

    // Vérifier si le mot de passe correspond
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Identifiants invalides'
      });
    }

    // Mettre à jour la date de dernière connexion
    user.lastLogin = new Date();
    await user.save();

    // Envoyer la réponse avec le token
    sendTokenResponse(user, 200, res);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Erreur lors de la connexion'
      });
    }
  }
};

// @desc    Déconnecter un utilisateur
// @route   GET /api/auth/logout
// @access  Private
export const logout = async (req: Request, res: Response) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
};

// @desc    Obtenir l'utilisateur actuellement connecté
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request & { user?: IUser }, res: Response) => {
  try {
    const user = await User.findById(req.user!._id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Erreur lors de la récupération du profil'
      });
    }
  }
};

// @desc    Mettre à jour les détails de l'utilisateur
// @route   PUT /api/auth/updatedetails
// @access  Private
export const updateDetails = async (req: Request & { user?: IUser }, res: Response) => {
  try {
    const fieldsToUpdate = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email
    };

    const user = await User.findByIdAndUpdate(req.user!._id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Erreur lors de la mise à jour du profil'
      });
    }
  }
};

// @desc    Mettre à jour le mot de passe
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = async (req: Request & { user?: IUser }, res: Response) => {
  try {
    const user = await User.findById(req.user!._id).select('+password');

    // Vérifier le mot de passe actuel
    const isMatch = await user!.matchPassword(req.body.currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Mot de passe actuel incorrect'
      });
    }

    user!.password = req.body.newPassword;
    await user!.save();

    sendTokenResponse(user!, 200, res);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Erreur lors de la mise à jour du mot de passe'
      });
    }
  }
};

// @desc    Mot de passe oublié
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Aucun utilisateur avec cet email'
      });
    }

    // Obtenir le token de réinitialisation
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Créer l'URL de réinitialisation
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;

    // Dans un environnement de production, envoyer un email avec l'URL de réinitialisation
    // Pour l'instant, nous retournons simplement l'URL dans la réponse
    
    res.status(200).json({
      success: true,
      data: {
        message: 'Email envoyé',
        resetUrl // À supprimer en production
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        error: 'Impossible d\'envoyer l\'email de réinitialisation'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la réinitialisation du mot de passe'
      });
    }
  }
};

// @desc    Réinitialiser le mot de passe
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
export const resetPassword = async (req: Request, res: Response) => {
  try {
    // Obtenir le token haché
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Token invalide ou expiré'
      });
    }

    // Définir le nouveau mot de passe
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Erreur lors de la réinitialisation du mot de passe'
      });
    }
  }
};

// Fonction utilitaire pour envoyer la réponse avec le token
const sendTokenResponse = (user: IUser, statusCode: number, res: Response) => {
  // Créer le token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE as string) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};
