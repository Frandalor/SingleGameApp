import { z } from 'zod';

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token mancante'),
  newPassword: z
    .string()
    .min(8, 'La password deve avere almeno 8 caratteri')
    .regex(/[A-Z]/, 'Deve contenere almeno una maiuscola')
    .regex(/[a-z]/, 'Deve contenere almeno una minuscola')
    .regex(/[0-9]/, 'Deve contenere almeno un numero')
    .regex(/[^A-Za-z0-9]/, 'Deve contenere almeno un carattere speciale'),
});

export default resetPasswordSchema;
