import { z } from 'zod';

export const userSchema = z.object({
  body: z
    .object({
      firstName: z
        .string()
        .min(1)
        .max(20, 'il nome può contenere al massimo 20 caratteri')
        .trim(),
      lastName: z
        .string()
        .min(1)
        .max(20, 'il cognome può contenere al massimo 20 caratteri')
        .trim(),
      userName: z
        .string()
        .min(6, 'minimo 6 caratteri')
        .max(20, 'max 20 caratteri')
        .regex(/^\S+$/, 'Lo username non può contenere spazi')
        .trim(),
      email: z.string().trim().pipe(z.email()),
      password: z
        .string()
        .min(8, 'Minimo 8 caratteri')
        .max(64, 'Massimo 64 caratteri')
        .regex(/[a-z]/, 'Deve contenere almeno una lettera minuscola')
        .regex(/[A-Z]/, 'Deve contenere almeno una lettera maiuscola')
        .regex(/[0-9]/, 'Deve contenere almeno un numero')
        .regex(/[^A-Za-z0-9]/, 'Deve contenere almeno un carattere speciale'),
    })
    .strict(),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Token mancante'),
    newPassword: z
      .string()
      .min(8, 'La password deve avere almeno 8 caratteri')
      .regex(/[A-Z]/, 'Deve contenere almeno una maiuscola')
      .regex(/[a-z]/, 'Deve contenere almeno una minuscola')
      .regex(/[0-9]/, 'Deve contenere almeno un numero')
      .regex(/[^A-Za-z0-9]/, 'Deve contenere almeno un carattere speciale'),
  })
  .strict();

export const loginSchema = z.object({
  body: z
    .object({
      email: z.string().trim().pipe(z.email()),
      password: z
        .string()
        .min(8, 'Minimo 8 caratteri')
        .max(64, 'Massimo 64 caratteri')
        .regex(/[a-z]/, 'Deve contenere almeno una lettera minuscola')
        .regex(/[A-Z]/, 'Deve contenere almeno una lettera maiuscola')
        .regex(/[0-9]/, 'Deve contenere almeno un numero')
        .regex(/[^A-Za-z0-9]/, 'Deve contenere almeno un carattere speciale'),
    })
    .strict(),
});
