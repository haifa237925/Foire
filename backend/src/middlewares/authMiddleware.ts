import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';
import User from '../models/User';

// Interface pour le token décodé
interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}

// Middleware pour protéger les routes
export const protect = async (
  req: Request & { user?: IUser },
  res: Response,
  next: NextFunction
) => {
  let token;

  // Vérifier si le token est dans les headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extraire le token du header Bearer
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    // Ou vérifier s'il est dans les cookies
    token = req.cookies.token;
  }

  // Vérifier si le token existe
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Non autorisé à accéder à cette ressource',
    });
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;

    // Ajouter l'utilisateur à la requête
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Non autorisé à accéder à cette ressource',
    });
  }
};

// Middleware pour autoriser certains rôles
export const authorize = (...roles: string[]) => {
  return (req: Request & { user?: IUser }, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Non autorisé à accéder à cette ressource',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Le rôle ${req.user.role} n'est pas autorisé à accéder à cette ressource`,
      });
    }
    next();
  };
};
