import express, { Application, Request, Response, NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db';

// Charger les variables d'environnement
dotenv.config();

// Connexion à la base de données
connectDB();

// Initialiser l'application Express
const app: Application = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());

// Logging en développement
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Dossier statique pour les uploads
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Route de base
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API TEPTAC Services - Plateforme de livres numériques' });
});

// Gestion des routes inexistantes
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Gestion des erreurs
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Erreur serveur'
  });
});

// Définir le port
const PORT = process.env.PORT || 5000;

// Démarrer le serveur
const server = app.listen(PORT, () => {
  console.log(`Serveur démarré en mode ${process.env.NODE_ENV} sur le port ${PORT}`);
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err: Error) => {
  console.log(`Erreur: ${err.message}`);
  // Fermer le serveur et quitter le processus
  server.close(() => process.exit(1));
});

export default app;