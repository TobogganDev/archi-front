import { z } from 'zod';
import { ProgramSchema } from '@/entities/program';

export interface CustomerStampStat {
  customer_id: string;
  stamp_count: number;
  last_visit: string | null;
}

export const StampSchema = z.object({
  id: z.string(),
  customer_id: z.string(),
  program_id: z.string(),
  merchant_id: z.string(),
  redeemed: z.boolean(),
  created_at: z.string(),
});

export const StampWithProgramSchema = StampSchema.extend({
  program: ProgramSchema,
});

export const StampWithRelationsSchema = StampSchema.extend({
  customer: z.object({ id: z.string(), name: z.string() }),
  program: ProgramSchema,
});

export const StampStatRawSchema = z.array(
  z.object({ customer_id: z.string(), created_at: z.string().nullable() }),
);

export type Stamp = z.infer<typeof StampSchema>;
export type StampInsert = Omit<Stamp, 'id' | 'created_at'>;
export type StampWithProgram = z.infer<typeof StampWithProgramSchema>;
export type StampWithRelations = z.infer<typeof StampWithRelationsSchema>;
