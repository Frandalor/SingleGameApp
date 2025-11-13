import express from 'express';
import {
  signup,
  verifyMail,
  passwordResetRequest,
  passwordReset,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);

router.get('/verify-mail', verifyMail);

router.post('/password-reset-req', passwordResetRequest);

router.post('/password-reset', passwordReset);

router.get('/login', async (req, res) => {});

export default router;
