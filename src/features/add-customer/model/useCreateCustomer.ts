import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCustomer } from '@/entities/customer';
import type { CustomerInsert } from '@/entities/customer';

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CustomerInsert) => createCustomer(data),
    onSuccess: (_customer, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['customers', variables.merchant_id] });
      void queryClient.invalidateQueries({ queryKey: ['stamp-stats', variables.merchant_id] });
    },
  });

  return {
    createCustomer: mutation.mutate,
    createCustomerAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
