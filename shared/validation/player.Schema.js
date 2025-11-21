import { z } from 'zod';
import { objectIdSchema } from './helper.js';

const playerIdParamSchema = z.object({
  playerId: objectIdSchema,
});
// ==========================================
// 1. SCHEMI FRONTEND
// ==========================================
export const playerFormSchema = z.object({
  player: z
    .string()
    .min(1, 'Il nome del giocatore è richiesto')
    .max(20, 'Il nome del giocatore può contenere max 20 caratteri'),
  category: z.number().int('La categoria deve essere un intero.').min(1).max(4),
  balance: z.number().optional().default(0),
  jolly: z.number().optional().default(0),

  // Aggiornato in base al modello Mongoose
  state: z
    .enum(['active', 'inactive', 'diffidato'], {
      message: "Lo stato deve essere 'active', 'inactive' o 'diffidato'.",
    })
    .optional()
    .default('active'),

  turnOver: z.number().optional().default(0), // Nuovo campo

  contacts: z
    .object({
      email: z.string().trim().pipe(z.email()).optional(),
      phone: z
        .string()
        .regex(/^\+?\d{7,15}$/, 'Numero di telefono non valido')
        .optional(),
    })
    .optional()
    .default({}),
});

export const updatePlayerFormSchema = playerFormSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Almeno un campo è richiesto per l'aggiornamento.",
  });

export const pointAdjustmentFormSchema = z.object({
  adjustments: z
    .array(
      z.object({
        playerId: objectIdSchema,
        points: z.number({
          required_error: 'I punti sono obbligatori',
        }),
        description: z
          .string()
          .min(3, 'La descrizione deve avere almeno 3 caratteri'),
      })
    )
    .min(1, 'Devi inviare almeno un aggiornamento'),
});

// schema per singolo aggiornamento di una quantita
export const singleUpdateFormSchema = z.object({
  playerId: objectIdSchema,
  amount: z
    .number()
    .int("L'importo deve essere un numero intero.")
    .refine((val) => val !== 0, {
      message: 'Importo deve essere diverso da 0',
    }),
});

export const multipleUpdateFormSchema = z.object({
  updates: z
    .array(singleUpdateFormSchema)
    .min(1, 'Devi specificare almeno un ID.')
    .max(150, 'Numero massimo di ID superato.'),
});

export const playerIdArrayFormSchema = z.object({
  playerIds: z
    .array(objectIdSchema)
    .min(1, 'Devi specificare almeno un ID.')
    .max(150, 'Numero massimo di ID superato.'),
});

// ==========================================
// 2. SCHEMI API (Wrapper - Per il Backend)
// ==========================================

// 1. POST /api/players (Add Player)
export const playerSchema = z.object({
  body: playerFormSchema,
});
export const updatePlayerSchema = z.object({
  body: updatePlayerFormSchema,
});

// 2. PATCH /api/players/:playerId (Modify Player)
export const modifyPlayerSchema = z.object({
  params: playerIdParamSchema,
  body: updatePlayerFormSchema,
});

// 3. POST /api/players/update/point-adjustment
export const pointAdjustmentsSchema = z.object({
  body: pointAdjustmentFormSchema,
});

// 4. POST /api/players/update/jolly-balance
export const multipleUpdateSchema = z.object({
  body: multipleUpdateFormSchema,
});

// 5. POST /api/players/update/reset-jolly-all
export const playerIdArraySchema = z.object({
  body: playerIdArrayFormSchema,
});

// 6. Schemi Parametri Semplici (GET /:id, Link User POST /:id, State PATCH /:id/state)
export const playerParamSchema = z.object({
  params: playerIdParamSchema,
});
