import express from 'express';

//-------------------------IMPORTS--------------------------------------------

//-------------------------NEW MATCHDAY------

import {
  newMatchDay,
  getAllMatchDay,
  getMatchDay,
  insertResults,
  confirmPlayers,
} from '../controllers/matchDay/matchDay.controller.js';

//--------------------PAIRING------------

import {
  getAllPairings,
  createPairings,
  resetPairing,
} from '../controllers/matchDay/pairing.controller.js';

//--------------------TEAM OF THE MATCH DAY-----
import {
  getAllTeamsDayMatch,
  deleteTeamfromMatchDay,
  createTeams,
} from '../controllers/matchDay/teams.controller.js';

//----------------CUSTOM FUNCTIONS----------------
import { playJollyForPlayer } from '../controllers/matchDay/jolly.controller.js';

//-----------------VALIDATION----------------------------

import { validate } from '../middleware/validation.middleware';

import { matchParamSchema, teamIdParamSchema } from '@SingleGameApp/shared';
const router = express.Router();

//-------------MATCHDAY---------------------------------------

router.get('/', getAllMatchDay);
router.post('/new', newMatchDay);
router.get('/:matchDayId', validate(matchParamSchema), getMatchDay);
router.post(
  '/:matchDayId/confirm-players',
  validate(matchParamSchema),
  confirmPlayers
);
router.post(
  '/:matchDayId/results',
  validate(matchParamSchema),
  insertResults
);

//-----------PAIRING------------------------

router.get(
  '/:matchDayId/pairing',
  validate(matchParamSchema),
  getAllPairings
);
router.post(
  '/:matchDayId/pairing',
  validate(matchParamSchema),
  createPairings
);
router.delete(
  '/:matchDayId/pairing',
  validate(matchParamSchema),
  resetPairing
);

//--------------JOLLY--------------------------

router.post(
  '/:matchDayId/jolly/:playerId/play',
  validateObjectId('matchDayId', 'playerId'),
  playJollyForPlayer
);

//----------TEAM OF MATCH DAY----------------

router.get(
  '/:matchDayId/teams',
  validate(matchParamSchema),
  getAllTeamsDayMatch
);
router.post('/:matchDayId/teams', validate(matchParamSchema), createTeams);
router.delete(
  '/:matchDayId/teams/:teamId',
  validate(matchParamSchema),
  validate(teamIdParamSchema),
  deleteTeamfromMatchDay
);

export default router;
