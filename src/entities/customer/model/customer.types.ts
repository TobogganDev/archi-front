import { z } from 'zod';

export const CustomerSchema = z.object({
  id: z.string(),
  merchant_id: z.string(),
  name: z.string(),
  email: z.string().nullable(),
  created_at: z.string(),
});

export const CustomerArraySchema = z.array(CustomerSchema);

export type Customer = z.infer<typeof CustomerSchema>;
export type CustomerInsert = Omit<Customer, 'id' | 'created_at'>;
export type CustomerUpdate = Partial<Omit<Customer, 'id' | 'created_at' | 'merchant_id'>>;
