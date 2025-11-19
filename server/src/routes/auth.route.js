import express from 'express';
import {
  signup,
  login,
  logout,
  verifyMail,
  passwordResetRequest,
  passwordReset,
  updateProfile,
  checkAuth,
} from '../controllers/auth.controller.js';

import { validate } from '../middleware/validation.middleware.js';
import { loginRequired } from '../middleware/auth.middleware.js';
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

// Check Auth
router.get('/check-auth', loginRequired, checkAuth);

//Password Reset
router.post('/password-reset-req', passwordResetRequest);
router.post('/password-reset', validate(resetPasswordSchema), passwordReset);

router.put('/update-profile', updateProfile);

export default router;
