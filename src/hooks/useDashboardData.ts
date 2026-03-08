import { useQuery } from '@tanstack/react-query';
import { getClients } from '@/api/clients';
import { getInvoices } from '@/api/invoices';
import { mapDbClient, mapDbInvoice } from '@/utils/transformers';
import type { Client, Invoice } from '@/types';

interface DashboardData {
  clients: Client[];
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch and manage dashboard data using React Query
 */
export const useDashboardData = (): DashboardData => {
  const clientsQuery = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
    select: (data) => data.map(mapDbClient),
  });

  const invoicesQuery = useQuery({
    queryKey: ['invoices'],
    queryFn: getInvoices,
    select: (data) => data.map(mapDbInvoice),
  });

  const loading = clientsQuery.isLoading || invoicesQuery.isLoading;
  const error = clientsQuery.error?.message || invoicesQuery.error?.message || null;

  const refetch = () => {
    clientsQuery.refetch();
    invoicesQuery.refetch();
  };

  return {
    clients: clientsQuery.data ?? [],
    invoices: invoicesQuery.data ?? [],
    loading,
    error,
    refetch,
  };
};
