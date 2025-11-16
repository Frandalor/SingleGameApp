import express from 'express';
import {
  newSeason,
  closeSeason,
  getAllSeason,
} from '../controllers/admin/season.controller.js';
import {
  newMatchDay,
  createTeams,
  deleteTeamfromMatchDay,
  getAllMatchDay,
  getMatchDay,
  insertResults
} from '../controllers/admin/matchDay.controller.js';
import {
  addPlayer,
  modifyPlayer,
  setPlayerState,
  getPlayers,
} from '../controllers/admin/players.controller.js';
import { validate } from '../lib/middlewares.js';
import {
  newSeasonSchema,
  playerSchema,
  updatePlayerSchema,
} from '../validation/admin.Schema.js';

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
router.patch('/player/:id/state', setPlayerState);

//-------------MATCHDAY---------------------------------------

router.get('/match-day', getAllMatchDay);
router.post('/match-day/new', newMatchDay);
router.get('/match-day/:matchDayId', getMatchDay);
router.post('/match-day/:matchDayId/teams', createTeams);
router.post('/match-day/:matchDayId/results', insertResults);
router.delete('/match-day/:matchDayId/teams/:teamName', deleteTeamfromMatchDay);


export default router;
