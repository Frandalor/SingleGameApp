//----------------------------IMPORTS--------------------------------

import express from 'express';
//--------------------------SEASON--------------------

import {
  newSeason,
  closeSeason,
  getAllSeason,
} from '../controllers/season/season.controller.js';

//---------------FORMAT

import { newFormat } from '../controllers/season/format.controller.js';

//-------------------------VALIDAZIONE-----------------------------------------
import { newSeasonSchema } from '@SingleGameApp/shared';
import { validate } from '../middleware/validation.middleware.js';
import { loginRequired } from '../middleware/auth.middleware.js';

//-------------------------ROUTES-----------------------------------------------------------------

const router = express.Router();

//-----------SEASON--------------------
router.get('/', getAllSeason);
router.post('/new', validate(newSeasonSchema), newSeason);
router.patch('/close', closeSeason);

//-----------FORMAT--------------------

router.post('/format/new', newFormat);
export default router;
