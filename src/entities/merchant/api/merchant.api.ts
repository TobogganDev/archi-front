import { supabase } from '@/shared/api';
import type { Merchant, MerchantUpdate } from '../model/merchant.types';

export async function getMerchant(id: string): Promise<Merchant> {
  const { data, error } = await supabase
    .from('merchants')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);

  return data as Merchant;
}

export async function updateMerchant(id: string, data: MerchantUpdate): Promise<Merchant> {
  const { data: updated, error } = await supabase
    .from('merchants')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return updated as Merchant;
}
