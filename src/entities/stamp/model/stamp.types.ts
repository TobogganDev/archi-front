import type { Program } from '@/entities/program';

export interface CustomerStampStat {
  customer_id: string;
  stamp_count: number;
  last_visit: string | null;
}

export interface Stamp {
  id: string;
  customer_id: string;
  program_id: string;
  merchant_id: string;
  redeemed: boolean;
  created_at: string;
}

export type StampInsert = Omit<Stamp, 'id' | 'created_at'>;

export type StampWithProgram = Stamp & { program: Program };
