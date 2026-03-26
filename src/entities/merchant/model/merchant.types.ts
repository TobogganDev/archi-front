import { z } from 'zod';

export const MerchantSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  created_at: z.string(),
});

export type Merchant = z.infer<typeof MerchantSchema>;
export type MerchantUpdate = Partial<Omit<Merchant, 'id' | 'created_at'>>;
