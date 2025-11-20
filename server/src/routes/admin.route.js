//----------------------------IMPORTS--------------------------------

import express from 'express';
//--------------------------SEASON--------------------

import {
  newSeason,
  closeSeason,
  getAllSeason,
} from '../controllers/admin/season/season.controller.js';

//-------------------------NEW MATCHDAY------

import {
  newMatchDay,
  getAllMatchDay,
  getMatchDay,
  insertResults,
  confirmPlayers,
} from '../controllers/admin/season/matchDay.controller.js';

//--------------------TEAM OF THE MATCH DAY-----
import {
  getAllTeamsDayMatch,
  deleteTeamfromMatchDay,
  createTeams,
} from '../controllers/admin/season/teamMatchDay.controller.js';

//--------------------PAIRING------------

import {
  getAllPairings,
  createPairings,
  resetPairing,
} from '../controllers/admin/season/pairing.controller.js';

//----------------PLAYERS-------------------

import {
  addPlayer,
  modifyPlayer,
  setPlayerState,
  getPlayers,
  linkPlayerToUser,
  updateJollyBalance,
  resetJollyforAll,
} from '../controllers/admin/players.controller.js';

//----------------CUSTOM FUNCTIONS----------------
import { playJollyForPlayer } from '../controllers/admin/season/customFunctions.controller.js';

// PLAYER POINT ADJUSTMENT
import {
  assignPointAdjustments,
  getAllPointAdjustments,
} from '../controllers/admin/playerPointAdjustment.controller.js';

//---------------FORMAT

import { newFormat } from '../controllers/admin/season/format.controller.js';

//-------------------------VALIDAZIONE-----------------------------------------
import {
  newSeasonSchema,
  playerSchema,
  updatePlayerSchema,
  multipleUpdateSchema,
  PlayerIdArraySchema,
  pointAdjustmentSchema,
} from '@SingleGameApp/shared';
import {
  validate,
  validateObjectId,
} from '../middleware/validation.middleware.js';
import { loginRequired } from '../middleware/auth.middleware.js';

//-------------------------ROUTES-----------------------------------------------------------------

const router = express.Router();

//-----------SEASON--------------------
router.get('/season', getAllSeason);
router.post('/season/new', validate(newSeasonSchema), newSeason);
router.patch('/season/close', closeSeason);

//----------PLAYERS-----------------------------------

router.get('/player', getPlayers);
router.post('/player', validate(playerSchema), addPlayer);

//--update jolly
router.post(
  '/player/update/jolly-balance',
  validate(multipleUpdateSchema),
  updateJollyBalance
);
router.post(
  '/player/update/reset-jolly-all',
  validate(PlayerIdArraySchema),
  resetJollyforAll
);

//---- penalty points
router.get('/player/point-adjustments', getAllPointAdjustments);

router.post(
  '/player/update/point-adjustment',
  validate(pointAdjustmentSchema),
  assignPointAdjustments
);
//---------
router.patch(
  '/player/:playerId',
  validateObjectId('playerId'),
  validate(updatePlayerSchema),
  modifyPlayer
);
router.post(
  '/player/:playerId',
  validateObjectId('playerId'),
  linkPlayerToUser
);
router.patch(
  '/player/:playerId/state',
  validateObjectId('playerId'),
  setPlayerState
);

//-------------MATCHDAY---------------------------------------

router.get('/match-day', getAllMatchDay);
router.post('/match-day/new', newMatchDay);
router.get(
  '/match-day/:matchDayId',
  validateObjectId('matchDayId'),
  getMatchDay
);
router.post(
  '/match-day/:matchDayId/confirm-players',
  validateObjectId('matchDayId'),
  confirmPlayers
);
router.post(
  '/match-day/:matchDayId/results',
  validateObjectId('matchDayId'),
  insertResults
);
//--------------JOLLY--------------------------

router.post(
  '/match-day/:matchDayId/jolly/:playerId/play',
  validateObjectId('matchDayId', 'playerId'),
  playJollyForPlayer
);

//-----------PAIRING------------------------

router.get(
  '/match-day/:matchDayId/pairing',
  validateObjectId('matchDayId'),
  getAllPairings
);
router.post(
  '/match-day/:matchDayId/pairing',
  validateObjectId('matchDayId'),
  createPairings
);
router.delete(
  '/match-day/:matchDayId/pairing',
  validateObjectId('matchDayId'),
  resetPairing
);

//----------TEAM OF MATCH DAY----------------

router.get(
  '/match-day/:matchDayId/teams',
  validateObjectId('matchDayId'),
  getAllTeamsDayMatch
);
router.post(
  '/match-day/:matchDayId/teams',
  validateObjectId('matchDayId'),
  createTeams
);
router.delete(
  '/match-day/:matchDayId/teams/:teamId',
  validateObjectId('matchDayId', 'teamId'),
  deleteTeamfromMatchDay
);

//-----------FORMAT--------------------

router.post('/format/new', newFormat);
export default router;
