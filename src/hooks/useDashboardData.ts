import { useState, useEffect } from 'react';
import { getClients } from '@/api/clients';
import { getInvoices } from '@/api/invoices';
import { useToast } from '@/hooks/use-toast';
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

      // Transform clients data
      const transformedClients: Client[] = clientsData.map((c: any) => ({
        id: c.id,
        companyName: c.company_name,
        contactName: c.contact_name ?? '',
        gstNumber: c.gst_number ?? '',
        phoneNumber: c.phone_number ?? '',
        phone: c.phone_number ?? '',
        email: c.email ?? '',
        bankAccountNumber: c.bank_account_number ?? '',
        bankDetails: c.bank_details ?? '',
        address: c.address ?? '',
        city: c.city ?? '',
        state: c.state ?? '',
        postalCode: c.postal_code ?? '',
        website: c.website ?? '',
        tags: c.tags ?? [],
        status: c.status as any,
        lastInvoiceDate: c.last_invoice_date ?? undefined,
        totalInvoiced: c.total_invoiced ?? undefined,
        pendingInvoices: c.pending_invoices ?? undefined,
        fyInvoices: c.fy_invoices ?? undefined,
      }));

      // Transform invoices data
      const transformedInvoices: Invoice[] = invoicesData.map((i: any) => ({
        id: i.id,
        invoiceNumber: i.invoice_number,
        clientId: i.client_id,
        clientName: i.clients?.company_name || 'Unknown Client',
        date: i.date,
        dueDate: i.due_date,
        amount: Number(i.total), // For compatibility with charts
        status: i.status,
        subtotal: Number(i.subtotal),
        gstAmount: Number(i.gst_amount),
        total: Number(i.total),
        gstType: i.gst_type,
        notes: i.notes,
        items: i.invoice_items?.map((item: any) => ({
          id: item.id,
          description: item.description,
          hsnCode: item.hsn_code,
          quantity: Number(item.quantity),
          rate: Number(item.rate),
          gstRate: Number(item.gst_rate),
          cgstRate: Number(item.cgst_rate),
          sgstRate: Number(item.sgst_rate),
          amount: Number(item.amount),
        })) || [],
      }));

      setClients(transformedClients);
      setInvoices(transformedInvoices);
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