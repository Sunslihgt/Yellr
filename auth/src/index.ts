import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import mongoose from 'mongoose';
import UserModel from './models/user.model';

dotenv.config({ path: './.env' });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 5000;

// Connect to MongoDB using Mongoose
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI!;
        if (!mongoUri) {
            throw new Error('MONGO_URI is not defined');
        }
        console.log('MONGO_URI:', mongoUri);
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully');
        // Show all documents in the database
        const db = mongoose.connection.db;
        if (db) {
            const collections = await db.listCollections().toArray();
            console.log('Collections:', collections);
        } else {
            console.log('No database connection');
        }
        // Show users in the database
        const users = await UserModel.find();
        console.log('Users:', users);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

app.use('/', authRoutes);

app.get('/test', (req, res) => {
    res.send('auth-service: API is running');
});

// Démarrage du serveur
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Auth service running on port ${PORT}`);
    });
};

startServer();
