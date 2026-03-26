import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProgram } from '@/entities/program';

interface DeleteProgramVariables {
  id: string;
  merchantId: string;
}

export function useDeleteProgram() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id }: DeleteProgramVariables) => deleteProgram(id),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['programs', variables.merchantId] });
    },
  });

  return {
    deleteProgram: mutation.mutate,
    deleteProgramAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
