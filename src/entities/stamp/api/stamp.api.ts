import { supabase } from '@/shared/api';
import type { CustomerStampStat, Stamp, StampInsert, StampWithProgram, StampWithRelations } from '../model/stamp.types';

export async function getStampsByCustomer(customerId: string): Promise<StampWithProgram[]> {
  const { data, error } = await supabase
    .from('stamps')
    .select('*, program:programs(*)')
    .eq('customer_id', customerId);

  if (error) throw new Error(error.message);

  return data as StampWithProgram[];
}

export async function getStampsByMerchant(merchantId: string): Promise<StampWithRelations[]> {
  const { data, error } = await supabase
    .from('stamps')
    .select('*, customer:customers(id, name), program:programs(*)')
    .eq('merchant_id', merchantId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return data as StampWithRelations[];
}

export async function addStamp(data: StampInsert): Promise<Stamp> {
  const { data: created, error } = await supabase
    .from('stamps')
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return created as Stamp;
}

export async function redeemStamp(id: string): Promise<Stamp> {
  const { data, error } = await supabase
    .from('stamps')
    .update({ redeemed: true })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data as Stamp;
}

export async function getActiveStampsCount(customerId: string, programId: string): Promise<number> {
  const { count, error } = await supabase
    .from('stamps')
    .select('*', { count: 'exact', head: true })
    .eq('customer_id', customerId)
    .eq('program_id', programId)
    .eq('redeemed', false);

  if (error) throw new Error(error.message);

  return count ?? 0;
}

export async function getStampStatsByMerchant(merchantId: string): Promise<CustomerStampStat[]> {
  const { data, error } = await supabase
    .from('stamps')
    .select('customer_id, created_at')
    .eq('merchant_id', merchantId);

  if (error) throw new Error(error.message);

  const statsMap = new Map<string, { count: number; last_visit: string | null }>();

  for (const stamp of data) {
    const existing = statsMap.get(stamp.customer_id);
    if (!existing) {
      statsMap.set(stamp.customer_id, { count: 1, last_visit: stamp.created_at ?? null });
    } else {
      existing.count++;
      if (stamp.created_at && (!existing.last_visit || stamp.created_at > existing.last_visit)) {
        existing.last_visit = stamp.created_at;
      }
    }
  }

  return Array.from(statsMap.entries()).map(([customer_id, stats]) => ({
    customer_id,
    stamp_count: stats.count,
    last_visit: stats.last_visit,
  }));
}
