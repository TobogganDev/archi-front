import { useQuery } from '@tanstack/react-query';
import { getMerchant } from '../api/merchant.api';

export function useMerchant(id: string) {
  return useQuery({
    queryKey: ['merchant', id],
    queryFn: () => getMerchant(id),
  });
}
