export interface Customer {
  id: string;
  merchant_id: string;
  name: string;
  email: string | null;
  created_at: string;
}

export type CustomerInsert = Omit<Customer, 'id' | 'created_at'>;

export type CustomerUpdate = Partial<Omit<Customer, 'id' | 'created_at' | 'merchant_id'>>;
