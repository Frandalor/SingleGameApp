import express from 'express';
import { connectDB } from './config/db.js';
import playerRoutes from './routes/player.route.js';
import cors from 'cors';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://192.162.1.2:5173'],
  })
);
app.use('/api/players', playerRoutes);

app.get('/', (req, res) => {
  res.send('home');
});

app.listen(3000, () => {
  console.log('listen on port 3000');
  connectDB();
});
