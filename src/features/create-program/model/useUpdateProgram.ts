import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProgram } from '@/entities/program';
import type { ProgramUpdate } from '@/entities/program';

interface UpdateProgramVariables {
  id: string;
  data: ProgramUpdate;
  merchantId: string;
}

export function useUpdateProgram() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: UpdateProgramVariables) => updateProgram(id, data),
    onSuccess: (_program, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['programs', variables.merchantId] });
    },
  });

  return {
    updateProgram: mutation.mutate,
    updateProgramAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
