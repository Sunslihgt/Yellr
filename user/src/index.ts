import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';
import followRoutes from './routes/follow.routes';
import mongoose from 'mongoose';

dotenv.config({ path: './.env' });

const app = express();
app.use(cors());
// Increase payload size limit for base64 images (default is 100kb, we set to 10MB)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const PORT = 5001;

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

app.use('/users', userRoutes);
app.use('/follow', followRoutes);

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
