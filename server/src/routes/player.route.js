import express from 'express';
import playerOld from '../models/PlayerOld.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching players', err });
  }
});

export default router;
