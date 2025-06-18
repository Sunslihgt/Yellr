import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';

dotenv.config({ path: './src/.env' });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 5000;

app.use('/', authRoutes);

app.get('/test', (req, res) => {
    res.send('auth-service: API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
