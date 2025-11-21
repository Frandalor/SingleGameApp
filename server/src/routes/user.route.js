import express from 'express';
const router = express.Router();

import {
  playJolly,
  getLeaderboard,
} from '../controllers/user/user.controller.js';

//validation

import { validate } from '../middleware/validation.middleware.js';
import { leaderboardSchema } from '@SingleGameApp/shared';

//===================================================
//=============   ROUTES   ==========================
//===================================================

router.get('/getLeaderboard', validate(leaderboardSchema), getLeaderboard);

router.post('/jolly', playJolly);

export default router;
