import { z } from 'zod';

export const addCustomerSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z
    .string()
    .email('Email invalide')
    .optional()
    .or(z.literal('')),
});

export type AddCustomerFormData = z.infer<typeof addCustomerSchema>;
