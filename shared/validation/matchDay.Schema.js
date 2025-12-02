import { z } from 'zod';
import { objectIdSchema } from './helper.js';

const matchIdSchema = z.object({
  matchDayId: objectIdSchema,
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

//SINGOLA SQUADRA
export const teamFormSchema = z.object({
  name: z.string().min(1, 'Il nome della squadra è obbligatorio'),
  _id: z.string().optional(),

  players: z
    .array(objectIdSchema)
    .min(1, 'La squadra deve avere almeno un giocatore')
    .refine((items) => new Set(items).size === items.length, {
      message:
        'Non puoi inserire lo stesso giocatore due volte nella stessa squadra',
    }),
});
//ARRAY DI SQUADRE
export const teamsArrayFormSchema = z.object({
  teams: z.array(teamFormSchema),
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

export const teamSchema = z.object({
  body: z.object({
    teams: z.array(teamFormSchema).min(1, 'Devi inserire almeno una squadra'),
  }),
});
