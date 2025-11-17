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
} from '../controllers/admin/players.controller.js';

//---------------FORMAT

import { newFormat } from '../controllers/admin/season/format.controller.js';

//-------------------------VALIDAZIONE ZOD-----------------------------------------
import {
  newSeasonSchema,
  playerSchema,
  updatePlayerSchema,
} from '../validation/admin.Schema.js';
import { validate } from '../lib/middlewares.js';

//-------------------------ROUTES-----------------------------------------------------------------

const router = express.Router();

//-----------SEASON--------------------
router.get('/season', getAllSeason);
router.post('/season/new', validate(newSeasonSchema), newSeason);
router.patch('/season/close', closeSeason);

//----------PLAYERS-----------------------------------

router.get('/player', getPlayers);
router.post('/player', validate(playerSchema), addPlayer);
router.patch('/player/:id', validate(updatePlayerSchema), modifyPlayer);
router.post('/player/:id', linkPlayerToUser);
router.patch('/player/:id/state', setPlayerState);

//-------------MATCHDAY---------------------------------------

router.get('/match-day', getAllMatchDay);
router.post('/match-day/new', newMatchDay);
router.get('/match-day/:matchDayId', getMatchDay);
router.post('/match-day/:matchDayId/confirm-players', confirmPlayers);
router.post('/match-day/:matchDayId/results', insertResults);

//-----------PAIRING------------------------

router.get('/match-day/:matchDayId/pairing', getAllPairings);
router.post('/match-day/:matchDayId/pairing', createPairings);
router.delete('/match-day/:matchDayId/pairing', resetPairing);

//----------TEAM OF MATCH DAY----------------

router.get('/match-day/:matchDayId/teams', getAllTeamsDayMatch);
router.post('/match-day/:matchDayId/teams', createTeams);
router.delete('/match-day/:matchDayId/teams/:teamId', deleteTeamfromMatchDay);

//-----------FORMAT--------------------

router.post('/format/new', newFormat);
export default router;
