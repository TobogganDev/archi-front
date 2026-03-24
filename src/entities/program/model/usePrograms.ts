import { useQuery } from '@tanstack/react-query';
import { getPrograms } from '../api/program.api';

export function usePrograms(merchantId: string) {
  return useQuery({
    queryKey: ['programs', merchantId],
    queryFn: () => getPrograms(merchantId),
  });
}
