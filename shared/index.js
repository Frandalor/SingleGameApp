export {
  newSeasonSchema,
  playerSchema,
  updatePlayerSchema,
  singleUpdateSchema,
  multipleUpdateSchema,
  PlayerIdArraySchema,
  pointAdjustmentSchema,
} from './validation/admin.Schema.js';

// shared/index.js

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
