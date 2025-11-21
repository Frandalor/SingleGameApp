import { z } from 'zod';
import { objectIdSchema } from './helper';

const matchIdSchema = z.object({
  playerId: objectIdSchema,
});
const teamIdSchema = z.object({
  teamId: objectIdSchema,
});

// ==========================================
// 1. SCHEMI FRONTEND
// ==========================================

// ==========================================
// 2. SCHEMI API (Wrapper - Per il Backend)
// ==========================================

export const matchParamSchema = z.object({
  params: matchIdSchema,
});
export const teamIdParamSchema = z.object({
  params: teamIdSchema,
});
