import { z } from 'zod';
import { objectIdSchema } from './helper';

// ==========================================
// 1. SCHEMI FRONTEND
// ==========================================

export const newSeasonSchema = z
  .object({
    name: string()
      .min(3, 'deve contenere min 3 caratteri')
      .max(24, 'può contenere max 24 caratteri')
      .trim(),
  })
  .strict();

// ==========================================
// 2. SCHEMI API (Wrapper - Per il Backend)
// ==========================================
