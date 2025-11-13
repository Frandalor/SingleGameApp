import express from 'express';
import { connectDB } from './lib/db.js';
import playerRoutes from './routes/player.route.js';
import authRoutes from './routes/auth.route.js';
import cors from 'cors';
import dotenv from 'dotenv';
import { ENV } from './lib/env.js';

const app = express();

dotenv.config();

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://192.162.1.2:5173'],
  })
);

app.use(express.json());

app.use('/api/players', playerRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('home');
});

app.listen(ENV.PORT, () => {
  console.log('listen on port 3000');
  connectDB();
});
