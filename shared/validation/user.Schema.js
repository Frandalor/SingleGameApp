import { z } from 'zod';
import { objectIdSchema } from './helper';

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

export const leaderboardSchema = z.object({
  query: leaderboardFormSchema,
});
