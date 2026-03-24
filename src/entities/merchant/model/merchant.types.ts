export interface Merchant {
  id: string
  name: string
  color: string
  created_at: string
}

export type MerchantUpdate = Partial<Omit<Merchant, 'id' | 'created_at'>>
