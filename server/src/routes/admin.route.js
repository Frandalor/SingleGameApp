import express from 'express';
import {
  newSeason,
  closeSeason,
  addPlayer,
  modifyPlayer,
  setPlayerState,
  getPlayers
} from '../controllers/admin.controller.js';
import { validate } from '../lib/middlewares.js';
import {
  newSeasonSchema,
  playerSchema,
  updatePlayerSchema,
} from '../validation/admin.Schema.js';

const router = express.Router();

// new season

router.post('/new-season', validate(newSeasonSchema), newSeason);
router.patch('/new-season', closeSeason);

// menage players

router.get('/player', getPlayers)
router.post('/player', validate(playerSchema), addPlayer);
router.patch('/player/:id', validate(updatePlayerSchema), modifyPlayer);
router.patch('/player/:id/state', setPlayerState);

export default router;
