import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import mongoose from 'mongoose';

dotenv.config({ path: './.env' });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 5000;

// Connect to MongoDB using Mongoose
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://root:example@mongo:27017/yellr?authSource=admin';
        if (!mongoUri) {
            throw new Error('MONGO_URI is not defined');
        }
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully');
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
