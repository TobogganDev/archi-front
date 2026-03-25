import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProgram } from '@/entities/program';
import type { ProgramInsert } from '@/entities/program';

export function useCreateProgram() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: ProgramInsert) => createProgram(data),
    onSuccess: (_program, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['programs', variables.merchant_id] });
    },
  });

  return {
    createProgram: mutation.mutate,
    createProgramAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
