import { z } from 'zod';
import { objectIdSchema } from './helper.js';

const matchIdSchema = z.object({
  playerId: objectIdSchema,
});
const teamIdSchema = z.object({
  teamId: objectIdSchema,
});

// ==========================================
// 1. SCHEMI FRONTEND
// ==========================================

export const leaderboardFormSchema = z.object({
  season: objectIdSchema.optional(),
  matchDayId: z.union([objectIdSchema, z.literal('')]).optional(),
});

// ==========================================
// 2. SCHEMI API (Wrapper - Per il Backend)
// ==========================================

export const matchParamSchema = z.object({
  params: matchIdSchema,
});
export const teamIdParamSchema = z.object({
  params: teamIdSchema,
});

export const leaderboardSchema = z.object({
  query: leaderboardFormSchema,
});
