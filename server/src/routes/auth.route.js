import express from 'express';
import {
  signup,
  login,
  logout,
  verifyMail,
  passwordResetRequest,
  passwordReset,
} from '../controllers/auth.controller.js';

import { validate } from '../lib/middlewares.js';
import {
  userSchema,
  resetPasswordSchema,
  loginSchema,
} from '../validation/authSchema.js';

const router = express.Router();

//Sign up

router.post('/signup', validate(userSchema), signup);
router.get('/verify-mail', verifyMail);

//Login

router.post('/login', validate(loginSchema), login);

//Logout

router.post('/logout', logout);

//Password Reset
router.post('/password-reset-req', passwordResetRequest);
router.post('/password-reset', validate(resetPasswordSchema), passwordReset);

export default router;
