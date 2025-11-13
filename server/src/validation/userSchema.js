import { z } from 'zod';

const userSchema = z.object({
  firstName: z
    .string()
    .min(1)
    .max(20, 'il nome può contenere al massimo 20 caratteri')
    .transform((val) => val.trim()),
  lastName: z
    .string()
    .min(1)
    .max(20, 'il cognome può contenere al massimo 20 caratteri')
    .transform((val) => val.trim()),
  userName: z
    .string()
    .min(1)
    .max(20, 'max 20 caratteri')
    .transform((val) => val.trim()),
  email: z.email().transform((val) => val.trim().toLowerCase()),
  password: z
    .string()
    .min(8, 'Minimo 8 caratteri')
    .max(64, 'Massimo 64 caratteri')
    .regex(/[a-z]/, 'Deve contenere almeno una lettera minuscola')
    .regex(/[A-Z]/, 'Deve contenere almeno una lettera maiuscola')
    .regex(/[0-9]/, 'Deve contenere almeno un numero')
    .regex(/[^A-Za-z0-9]/, 'Deve contenere almeno un carattere speciale'),
});

export default userSchema;
