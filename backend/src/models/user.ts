import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Interface pour le modèle User
export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'writer' | 'reader' | 'admin';
  profilePicture?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isVerified: boolean;
  isTwoFactorEnabled: boolean;
  twoFactorSecret?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  stripeCustomerId?: string;
  preferences: {
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
    };
    theme: 'light' | 'dark';
  };
  socialAuth?: {
    google?: {
      id: string;
      token: string;
    };
    facebook?: {
      id: string;
      token: string;
    };
  };
  matchPassword(enteredPassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
  getResetPasswordToken(): string;
}

// Schéma pour le modèle User
const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Veuillez ajouter un email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Veuillez ajouter un email valide',
      ],
    },
    password: {
      type: String,
      required: [true, 'Veuillez ajouter un mot de passe'],
      minlength: 6,
      select: false,
    },
    firstName: {
      type: String,
      required: [true, 'Veuillez ajouter un prénom'],
    },
    lastName: {
      type: String,
      required: [true, 'Veuillez ajouter un nom'],
    },
    role: {
      type: String,
      enum: ['writer', 'reader', 'admin'],
      default: 'reader',
    },
    profilePicture: {
      type: String,
      default: 'default-avatar.jpg',
    },
    bio: {
      type: String,
    },
    lastLogin: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isTwoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
    stripeCustomerId: {
      type: String,
    },
    preferences: {
      language: {
        type: String,
        default: 'fr',
      },
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        push: {
          type: Boolean,
          default: true,
        },
      },
      theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light',
      },
    },
    socialAuth: {
      google: {
        id: {
          type: String,
        },
        token: {
          type: String,
          select: false,
        },
      },
      facebook: {
        id: {
          type: String,
        },
        token: {
          type: String,
          select: false,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Crypter le mot de passe avant l'enregistrement
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Méthode pour vérifier si le mot de passe correspond
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Méthode pour générer un token JWT
UserSchema.methods.getSignedJwtToken = function (): string {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Méthode pour générer et hacher un token de réinitialisation de mot de passe
UserSchema.methods.getResetPasswordToken = function (): string {
  // Générer un token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hacher le token et le stocker dans resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Définir l'expiration du token (10 minutes)
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export default mongoose.model<IUser>('User', UserSchema);
