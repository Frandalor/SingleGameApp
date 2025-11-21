import express from 'express';

//-------------IMPORTS-----------------------------

//----------------PLAYERS-------------------

import {
  addPlayer,
  modifyPlayer,
  setPlayerState,
  getPlayers,
  linkPlayerToUser,
  updateJollyBalance,
  resetJollyforAll,
} from '../controllers/player/players.controller.js';

// PLAYER POINT ADJUSTMENT
import {
  assignPointAdjustments,
  getAllPointAdjustments,
} from '../controllers/player/playerPointAdjustment.controller.js';

//-------------------------VALIDAZIONE-----------------------------------------

import { validate } from '../middleware/validation.middleware';
import {
  playerSchema,
  updatePlayerSchema,
  pointAdjustmentSchema,
  multipleUpdateSchema,
  playerIdArraySchema,
  playerParamSchema,
} from '@SingleGameApp/shared';

const router = express.Router();

//----------PLAYERS-----------------------------------

router.get('/', getPlayers);
router.post('/', validate(playerSchema), addPlayer);

//--update jolly
router.post(
  '/update/jolly-balance',
  validate(multipleUpdateSchema),
  updateJollyBalance
);
router.post(
  '/update/reset-jolly-all',
  validate(playerIdArraySchema),
  resetJollyforAll
);

//---- penalty points
router.get('/point-adjustments', getAllPointAdjustments);

router.post(
  '/update/point-adjustment',
  validate(pointAdjustmentSchema),
  assignPointAdjustments
);
//---------
router.patch(
  '/:playerId',
  validate(playerParamSchema),
  validate(updatePlayerSchema),
  modifyPlayer
);
router.post('/:playerId', validateObjectId('playerId'), linkPlayerToUser);
router.patch('/:playerId/state', validateObjectId('playerId'), setPlayerState);

export default router;
