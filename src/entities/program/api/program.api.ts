import { supabase } from '@/shared/api';
import { ProgramSchema, ProgramArraySchema } from '../model/program.types';
import type { Program, ProgramInsert, ProgramUpdate } from '../model/program.types';

export async function getPrograms(merchantId: string): Promise<Program[]> {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('merchant_id', merchantId);

  if (error) throw new Error(error.message);

  return ProgramArraySchema.parse(data);
}

export async function getProgramById(id: string): Promise<Program> {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);

  return ProgramSchema.parse(data);
}

export async function createProgram(data: ProgramInsert): Promise<Program> {
  const { data: created, error } = await supabase
    .from('programs')
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return ProgramSchema.parse(created);
}

export async function updateProgram(id: string, data: ProgramUpdate): Promise<Program> {
  const { data: updated, error } = await supabase
    .from('programs')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return ProgramSchema.parse(updated);
}

export async function deleteProgram(id: string): Promise<void> {
  const { error } = await supabase
    .from('programs')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}
