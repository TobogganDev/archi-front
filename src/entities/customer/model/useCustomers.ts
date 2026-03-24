import { useQuery } from '@tanstack/react-query';
import { getCustomers, getCustomerById } from '../api/customer.api';

export function useCustomers(merchantId: string) {
  return useQuery({
    queryKey: ['customers', merchantId],
    queryFn: () => getCustomers(merchantId),
  });
}

export function useCustomerById(id: string) {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: () => getCustomerById(id),
  });
}
