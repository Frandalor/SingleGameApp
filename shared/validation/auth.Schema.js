import { z } from 'zod';

// ==========================================
// 1. SCHEMI FRONTEND
// ==========================================

export const userFormSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'Il nome deve contenere almeno 2 caratteri')
      .max(20, 'Il nome non può superare i 20 caratteri')
      .trim(),
    lastName: z
      .string()
      .min(2, 'Il cognome deve contenere almeno 2 caratteri')
      .max(20, 'Il cognome non può superare i 20 caratteri')
      .trim(),
    userName: z
      .string()
      .min(6, 'Lo username deve contenere almeno 6 caratteri')
      .max(20, 'Lo username non può superare i 20 caratteri')
      .regex(/^\S+$/, 'Lo username non può contenere spazi')
      .trim(),
    email: z
      .string()
      .trim()
      .pipe(z.email('Inserisci un indirizzo email valido')),
    password: z
      .string()
      .min(8, 'La password deve contenere almeno 8 caratteri')
      .max(64, 'La password non può superare i 64 caratteri')
      .regex(/[a-z]/, 'La password deve contenere almeno una lettera minuscola')
      .regex(/[A-Z]/, 'La password deve contenere almeno una lettera maiuscola')
      .regex(/[0-9]/, 'La password deve contenere almeno un numero')
      .regex(
        /[^A-Za-z0-9]/,
        'La password deve contenere almeno un carattere speciale'
      ),
  })
  .strict();

// LOGIN
export const loginFormSchema = userFormSchema.pick({
  email: true,
  password: true,
});

// FORGOT PASSWORD

export const emailFormSchema = userFormSchema.pick({
  email: true,
});

// RESET PASSWORD

export const resetPasswordFormSchema = z
  .object({
    newPassword: userFormSchema.shape.password,
  })
  .strict();

// ==========================================
// 2. SCHEMI API (Wrapper - Per il Backend)
// ==========================================

// Nel Backend riutilizzi lo schema sopra, ma lo avvolgi in "body"
export const userSchema = z.object({
  body: userFormSchema,
});

export const loginSchema = z.object({
  body: loginFormSchema,
});

export const resetPasswordSchema = z.object({
  params: z.object({
    token: z.string(),
  }),
  body: resetPasswordFormSchema,
});

export const emailSchema = z.object({
  body: emailFormSchema,
});
