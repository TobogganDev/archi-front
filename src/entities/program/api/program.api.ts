import { supabase } from '@/shared/api';
import type { Program, ProgramInsert, ProgramUpdate } from '../model/program.types';

export async function getPrograms(merchantId: string): Promise<Program[]> {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('merchant_id', merchantId);

  if (error) throw new Error(error.message);

  return data as Program[];
}

export async function getProgramById(id: string): Promise<Program> {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);

  return data as Program;
}

export async function createProgram(data: ProgramInsert): Promise<Program> {
  const { data: created, error } = await supabase
    .from('programs')
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return created as Program;
}

export async function updateProgram(id: string, data: ProgramUpdate): Promise<Program> {
  const { data: updated, error } = await supabase
    .from('programs')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return updated as Program;
}

export async function deleteProgram(id: string): Promise<void> {
  const { error } = await supabase
    .from('programs')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}
