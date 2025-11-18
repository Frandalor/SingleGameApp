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
  email: z.email().optional(),
  phone: z.string().optional(),
});
// schema mongoose

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Formato ID non valido.');

// schema per singolo aggiornamento di una quantita
export const singleUpdateSchema = z.object({
  playerId: objectIdSchema,
  amount: z
    .number()
    .int("L'importo deve essere un numero intero.")
    .refine((val) => val !== 0, {
      message: 'Importo deve essere diverso da 0',
    }),
});

export const multipleUpdateSchema = z.object({
  updates: z
    .array(singleUpdateSchema)
    .min(1, 'Devi specificare almeno un ID.')
    .max(150, 'Numero massimo di ID superato.'), // limite id selezionabili 150
});

export const PlayerIdArraySchema = z.object({
  // Il campo 'playerIds' deve esistere nell'oggetto req.body
  playerIds: z
    .array(objectIdSchema) // 1. Deve essere un array di ID validi
    .min(1, 'Devi specificare almeno un ID.') // 2. Non può essere vuoto
    .max(150, 'Numero massimo di ID superato.'), // 3. Limite di sicurezza (150)
});
