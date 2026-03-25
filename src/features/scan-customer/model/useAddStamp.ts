import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addStamp } from '@/entities/stamp';
import type { StampInsert } from '@/entities/stamp';

export function useAddStamp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StampInsert) => addStamp(data),
    onSuccess: (_result, variables) => {
      // Invalidate all stamp-related queries for this customer so the UI refreshes
      queryClient.invalidateQueries({ queryKey: ['stamps', variables.customer_id] });
      queryClient.invalidateQueries({ queryKey: ['stamps-count'] });
      queryClient.invalidateQueries({ queryKey: ['stamp-stats'] });
    },
  });
}
