import { supabase } from '@/shared/api';
import { CustomerSchema, CustomerArraySchema } from '../model/customer.types';
import type { Customer, CustomerInsert, CustomerUpdate } from '../model/customer.types';

export async function getCustomers(merchantId: string): Promise<Customer[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('merchant_id', merchantId);

  if (error) throw new Error(error.message);

  return CustomerArraySchema.parse(data);
}

export async function getCustomerById(id: string): Promise<Customer> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);

  return CustomerSchema.parse(data);
}

export async function createCustomer(data: CustomerInsert): Promise<Customer> {
  const { data: created, error } = await supabase
    .from('customers')
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return CustomerSchema.parse(created);
}

export async function updateCustomer(id: string, data: CustomerUpdate): Promise<Customer> {
  const { data: updated, error } = await supabase
    .from('customers')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return CustomerSchema.parse(updated);
}

export async function deleteCustomer(id: string): Promise<void> {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}
