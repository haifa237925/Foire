import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDB connecté: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Erreur de connexion à MongoDB: ${error.message}`);
    } else {
      console.error('Erreur inconnue lors de la connexion à MongoDB');
    }
    process.exit(1);
  }
};

export default connectDB;
