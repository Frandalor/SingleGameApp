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
  resendVerificationEmail,
} from '../controllers/user/auth.controller.js';

import { validate } from '../middleware/validation.middleware.js';
import { loginRequired } from '../middleware/auth.middleware.js';
import {
  userSchema,
  resetPasswordSchema,
  loginSchema,
  emailSchema,
} from '@SingleGameApp/shared';
const router = express.Router();

//Sign up

router.post('/signup', validate(userSchema), signup);
router.post('/verify-email', verifyMail);
router.post(
  '/resend-verification',
  validate(emailSchema),
  resendVerificationEmail
);

//Login

router.post('/login', validate(loginSchema), login);

//Logout

router.post('/logout', logout);

// Check Auth
router.get('/check-auth', loginRequired, checkAuth);

//Password Reset
router.post('/password-reset-req', passwordResetRequest);
router.post(
  '/password-reset/:token',
  validate(resetPasswordSchema),
  passwordReset
);

router.put('/update-profile', updateProfile);

export default router;
