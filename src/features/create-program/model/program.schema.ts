import { z } from 'zod';

export const createProgramSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  stamps_required: z
    .number({ invalid_type_error: 'Veuillez entrer un nombre' })
    .int('Doit être un entier')
    .min(1, 'Minimum 1 tampon'),
  reward: z.string().min(2, 'La récompense doit contenir au moins 2 caractères'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur invalide'),
});

export type CreateProgramFormData = z.infer<typeof createProgramSchema>;
