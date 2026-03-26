import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCustomer } from '@/entities/customer';

interface DeleteCustomerVariables {
  id: string;
  merchantId: string;
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id }: DeleteCustomerVariables) => deleteCustomer(id),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['customers', variables.merchantId] });
    },
  });

  return {
    deleteCustomer: mutation.mutate,
    deleteCustomerAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
