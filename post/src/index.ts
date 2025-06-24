import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import postRoutes from './routes/post.routes';

dotenv.config({ path: './.env' });

const app = express();

// Configuration CORS simplifiée
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 5002;

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://root:example@mongo:27017/yellr?authSource=admin';
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

app.use('/posts', postRoutes);

app.get('/test', (req, res) => {
    res.json({
        message: 'post-service: API is running',
        service: 'POST',
        port: PORT,
        endpoints: [
            'POST /api/posts - Créer un post',
            'GET /api/posts - Voir les derniers posts'
        ]
    });
});

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Post service running on port ${PORT}`);
        console.log('Endpoints disponibles :');
        console.log(`- POST http://localhost:${PORT}/api/posts`);
        console.log(`- GET http://localhost:${PORT}/api/posts/test`);
    });
};

startServer().catch(console.error);
