import express from 'express';
import { connectDB } from './lib/db.js';
import userRoutes from './routes/user.route.js';
import seasonRoutes from './routes/season.route.js';
import authRoutes from './routes/auth.route.js';
import matchDayRoutes from './routes/matchDay.route.js';
import playerRoutes from './routes/player.route.js';
import cors from 'cors';
import dotenv from 'dotenv';
import { ENV } from './lib/env.js';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { logger } from './lib/logger.js';

const app = express();

dotenv.config();

app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/season', seasonRoutes);
app.use('/api/match-day', matchDayRoutes);
app.use('/api/player', playerRoutes);

app.get('/', (req, res) => {
  res.send('home');
});

app.listen(ENV.PORT, () => {
  logger.start('listen on port 3000');
  connectDB();
});
