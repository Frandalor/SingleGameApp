import { string, z } from 'zod';

export const newSeasonSchema = z
  .object({
    name: string()
      .min(3, 'deve contenere min 3 caratteri')
      .max(24, 'può contenere max 24 caratteri')
      .trim(),
  })
  .strict();

export const playerSchema = z.object({
  player: z
    .string()
    .min(1, 'Il nome del giocatore è richiesto')
    .max(20, 'Il nome del giocatore può contenere max 20 caratteri'),
  category: z.number().min(1).max(4),
  balance: z.number().optional().default(0),
  jolly: z.number().optional().default(0),
  diffidato: z.boolean().optional().default(false),

  contacts: z
    .object({
      email: z.string().trim().pipe(z.email()).optional(),
      phone: z
        .string()
        .regex(/^\+?\d{7,15}$/, 'Numero di telefono non valido')
        .optional(),
    })
    .optional(),
});

export const updatePlayerSchema = z.object({
  player: z.string().optional(),
  category: z.number().min(1).max(4).optional(),
  balance: z.number().optional(),
  jolly: z.number().optional(),
  diffidato: z.boolean().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});
