import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import mongoose from 'mongoose';

dotenv.config({ path: './.env' });

const app = express();
app.use(cors());

// Skip JSON parsing for /authenticate route to be used for auth subrequests
app.use((req, res, next) => {
    if (req.path === '/authenticate') {
        return next();
    }
    express.json({ limit: '10mb' })(req, res, next);
});

app.use((req, res, next) => {
    if (req.path === '/authenticate') {
        return next();
    }
    express.urlencoded({ extended: true, limit: '10mb' })(req, res, next);
});

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
