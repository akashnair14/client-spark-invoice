import { useState, useEffect } from 'react';
import { getClients } from '@/api/clients';
import { getInvoices } from '@/api/invoices';
import { useToast } from '@/hooks/use-toast';
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
 * Custom hook to fetch and manage dashboard data
 */
export const useDashboardData = (): DashboardData => {
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [clientsData, invoicesData] = await Promise.all([
        getClients(),
        getInvoices()
      ]);

      setClients(clientsData.map(mapDbClient));
      setInvoices(invoicesData.map(mapDbInvoice));
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch dashboard data';
      setError(errorMessage);
      toast({
        title: 'Error loading dashboard',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    clients,
    invoices,
    loading,
    error,
    refetch: fetchData,
  };
};
