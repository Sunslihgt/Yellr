import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';
import mongoose from 'mongoose';
import UserModel from './models/user.model';

dotenv.config({ path: './.env' });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 5001;

// Connect to MongoDB using Mongoose
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI!;
        if (!mongoUri) {
            throw new Error('MONGO_URI is not defined');
        }
        // console.log('MONGO_URI:', mongoUri);
        await mongoose.connect(mongoUri);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

app.use('/users', userRoutes);

app.get('/test', (req, res) => {
    res.send('user-service: API is running');
});

// Démarrage du serveur
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`User service running on port ${PORT}`);
    });
};

startServer();
