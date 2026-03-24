export interface Program {
  id: string;
  merchant_id: string;
  name: string;
  stamps_required: number;
  reward: string;
  color: string;
  created_at: string;
}

export type ProgramInsert = Omit<Program, 'id' | 'created_at'>;

export type ProgramUpdate = Partial<Omit<Program, 'id' | 'created_at' | 'merchant_id'>>;
