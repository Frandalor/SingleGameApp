import { z } from 'zod';
import { objectIdSchema } from './helper.js';

// ==========================================
// 1. SCHEMI FRONTEND
// ==========================================

export const newSeasonFormSchema = z
  .object({
    name: z
      .string()
      .min(3, 'deve contenere min 3 caratteri')
      .max(24, 'può contenere max 24 caratteri')
      .trim(),
    startDate: z.preprocess((arg) => {
      if (!arg || (typeof arg === 'string' && arg.trim() === '')) {
        return new Date();
      }
      return arg;
    }, z.coerce.date()),
  })
  .strict();

// ==========================================
// 2. SCHEMI API (Wrapper - Per il Backend)
// ==========================================

export const newSeasonSchema = z.object({
  body: newSeasonFormSchema,
});
