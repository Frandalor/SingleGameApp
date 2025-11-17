import express from 'express';
const router = express.Router();

import { playJolly } from '../controllers/user/user.controller.js';

router.post('/jolly', playJolly);

export default router;
