import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import commentRoutes from './routes/comment.routes';

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());

app.use('/', commentRoutes);

app.get('/test', (req, res) => {
    res.json({ message: 'Comment Service is working!' });
});

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://root:example@mongo:27017/yellr?authSource=admin');
        console.log('MongoDB connection successful (Comment Service)');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Comment Service started on port ${PORT}`);
    });
});