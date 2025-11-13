import express from 'express';
import {
  signup,
  login,
  logout,
  verifyMail,
  passwordResetRequest,
  passwordReset,
} from '../controllers/auth.controller.js';

const router = express.Router();

//Sign up

router.post('/signup', signup);
router.get('/verify-mail', verifyMail);

//Login

router.post('/login', login);

//Logout

router.post('/logout', logout);

//Password Reset
router.post('/password-reset-req', passwordResetRequest);
router.post('/password-reset', passwordReset);

export default router;
