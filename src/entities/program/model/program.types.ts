import { z } from 'zod';

export const ProgramSchema = z.object({
  id: z.string(),
  merchant_id: z.string(),
  name: z.string(),
  stamps_required: z.number(),
  reward: z.string(),
  color: z.string(),
  created_at: z.string(),
});

export const ProgramArraySchema = z.array(ProgramSchema);

export type Program = z.infer<typeof ProgramSchema>;
export type ProgramInsert = Omit<Program, 'id' | 'created_at'>;
export type ProgramUpdate = Partial<Omit<Program, 'id' | 'created_at' | 'merchant_id'>>;
