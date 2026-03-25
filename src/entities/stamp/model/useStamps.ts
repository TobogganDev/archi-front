import { useQuery } from '@tanstack/react-query';
import { getActiveStampsCount, getStampsByCustomer, getStampsByMerchant, getStampStatsByMerchant } from '../api/stamp.api';

export function useStampsByCustomer(customerId: string) {
  return useQuery({
    queryKey: ['stamps', customerId],
    queryFn: () => getStampsByCustomer(customerId),
  });
}

export function useStampsByMerchant(merchantId: string) {
  return useQuery({
    queryKey: ['stamps', 'merchant', merchantId],
    queryFn: () => getStampsByMerchant(merchantId),
  });
}

export function useActiveStampsCount(customerId: string, programId: string) {
  return useQuery({
    queryKey: ['stamps-count', customerId, programId],
    queryFn: () => getActiveStampsCount(customerId, programId),
  });
}

export function useStampStatsByMerchant(merchantId: string) {
  return useQuery({
    queryKey: ['stamp-stats', merchantId],
    queryFn: () => getStampStatsByMerchant(merchantId),
    enabled: !!merchantId,
  });
}
