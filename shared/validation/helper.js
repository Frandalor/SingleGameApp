import { z } from 'zod';

// schema mongoose

export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Formato ID non valido.');
