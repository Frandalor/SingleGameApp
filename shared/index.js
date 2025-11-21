//---------------------PLAYER ------------------------------

export {
  // 1. Schemi Base / Frontend
  playerFormSchema,
  updatePlayerFormSchema,
  pointAdjustmentFormSchema,
  singleUpdateFormSchema,
  multipleUpdateFormSchema,
  playerIdArrayFormSchema, // Usato per reset jolly

  // 2. Schemi API (Backend Wrappers)
  addPlayerSchema,
  modifyPlayerSchema,
  pointAdjustmentsSchema,
  updateJollyBalanceSchema,
  resetJollyforAllSchema,
  playerParamSchema,
  updatePlayerSchema,
  // Schema per ID nei params (GET /:id)
} from './validation/player.Schema.js';

//------------------------AUTH ---------------------

export {
  // 1. Schemi per il Frontend (React - useForm)
  userFormSchema,
  loginFormSchema,
  resetPasswordFormSchema,
  emailFormSchema,

  // 2. Schemi per il Backend (Node - API Validation)
  userSchema,
  loginSchema,
  resetPasswordSchema,
  emailSchema,
} from './validation/auth.Schema.js';

//-------------------------USER-------------------------------

export {
  // frontend
  leaderboardFormSchema,

  //backend
  leaderboardSchema,
} from './validation/user.Schema.js';

//---------------------------SEASON----------------------

export {
  // Frontend
  newSeasonSchema,
} from './validation/season.Schema.js';

//---------------------MATCHID---------------

export {
  //backend
  matchParamSchema,
  teamIdParamSchema,
} from './validation/matchDay.Schema.js';
