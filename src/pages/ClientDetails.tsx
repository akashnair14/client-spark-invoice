import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Client } from "@/types";
import ClientForm from "@/components/clients/ClientForm";
import { useToast } from "@/components/ui/use-toast";
import ClientInfoCard from "@/components/clients/ClientInfoCard";
import ClientInvoicesCard from "@/components/clients/ClientInvoicesCard";
import { getClient, updateClient, deleteClient as apiDeleteClient } from "@/api/clients";

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [clientInvoices, setClientInvoices] = useState<any[]>([]); // Empty for now, TODO: fetch from backend
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [currentYearInvoices, setCurrentYearInvoices] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const PAGE_SIZE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMonth, selectedYear, clientInvoices]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    getClient(id)
      .then((data) => {
        setClient({
          id: data.id,
          companyName: data.company_name,
          contactName: data.contact_name ?? "",
          gstNumber: data.gst_number ?? "",
          phoneNumber: data.phone_number ?? "",
          phone: data.phone_number ?? "",
          email: data.email ?? "",
          bankAccountNumber: data.bank_account_number ?? "",
          bankDetails: data.bank_details ?? "",
          address: data.address ?? "",
          city: data.city ?? "",
          state: data.state ?? "",
          postalCode: data.postal_code ?? "",
          website: data.website ?? "",
          tags: data.tags ?? [],
          status: data.status as any,
          lastInvoiceDate: data.last_invoice_date ?? undefined,
          totalInvoiced: data.total_invoiced ?? undefined,
          pendingInvoices: data.pending_invoices ?? undefined,
          fyInvoices: data.fy_invoices ?? undefined,
        });
        setLoading(false);

        // INVOICE DATA REMOVED
        setClientInvoices([]); // TODO: Replace with backend fetch

        // Compute current FY
        const today = new Date();
        const currentYear = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
        const startDate = new Date(`${currentYear}-04-01`);
        const endDate = new Date(`${currentYear + 1}-03-31`);
        setCurrentYearInvoices([]);
      })
      .catch((err) => {
        console.error("Error loading client:", err);
        setLoading(false);
        setClient(null);
      });
  }, [id]);

  const filteredInvoices = useMemo(() => {
    return clientInvoices.filter(invoice => {
      let match = true;
      if (selectedMonth !== "All") {
        const monthIdx = [
          "January","February","March","April","May","June","July",
          "August","September","October","November","December"
        ].indexOf(selectedMonth);
        if (monthIdx >= 0) {
          const invDate = new Date(invoice.date);
          match = match && invDate.getMonth() === monthIdx;
        }
      }
      if (selectedYear !== "All") {
        const invDate = new Date(invoice.date);
        match = match && invDate.getFullYear() === parseInt(selectedYear);
      }
      return match;
    });
  }, [clientInvoices, selectedMonth, selectedYear]);

  const totalPages = Math.ceil(filteredInvoices.length / PAGE_SIZE);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const resetFilters = () => {
    setSelectedMonth("All");
    setSelectedYear("All");
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-xl font-semibold">Loading client details…</h2>
        </div>
      </Layout>
    );
  }

  if (!client) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-xl font-semibold">Client not found</h2>
          <p className="text-muted-foreground mt-2">The client you're looking for doesn't exist.</p>
          <button
            className="mt-4 bg-muted px-4 py-2 rounded border"
            onClick={() => navigate('/clients')}
          >
            &larr; Back to Clients
          </button>
        </div>
      </Layout>
    );
  }

  // Handlers
  const handleEditClient = async (updatedClient: Omit<Client, "id">) => {
    if (!id) return;
    // Always use snake_case keys for Supabase
    const updates = {
      company_name: updatedClient.companyName,
      contact_name: updatedClient.contactName,
      gst_number: updatedClient.gstNumber,
      phone_number: updatedClient.phoneNumber,
      bank_account_number: updatedClient.bankAccountNumber,
      bank_details: updatedClient.bankDetails,
      address: updatedClient.address,
      city: updatedClient.city,
      state: updatedClient.state,
      postal_code: updatedClient.postalCode,
      website: updatedClient.website,
      tags: updatedClient.tags,
      status: updatedClient.status,
      email: updatedClient.email,
    };
    try {
      await updateClient(id, updates);
      setClient({
        ...client,
        ...updatedClient
      });
      setIsEditClientOpen(false);
      toast({
        title: "Client Updated",
        description: `${updatedClient.companyName} has been updated successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteClient = async () => {
    try {
      if (id) await apiDeleteClient(id);
      toast({
        title: "Client Deleted",
        description: `${client.companyName} has been deleted.`,
      });
      navigate('/clients');
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleCreateInvoice = () => {
    navigate(`/invoices/new?clientId=${client.id}`);
  };

  return (
    <Layout>
      <div className="page-header flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            className="mr-4 p-2 rounded border"
            onClick={() => navigate('/clients')}
          >
            &larr;
          </button>
          <div>
            <h1 className="page-title">{client.companyName}</h1>
            <p className="page-description text-sm text-muted-foreground">
              Client profile and details
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <ClientInfoCard
          client={client}
          currentYearInvoicesCount={currentYearInvoices.length}
          onCreateInvoice={handleCreateInvoice}
          onEdit={() => setIsEditClientOpen(true)}
          onDelete={handleDeleteClient}
        />
        <ClientInvoicesCard
          client={client}
          invoices={clientInvoices}
          filteredInvoices={filteredInvoices}
          paginatedInvoices={paginatedInvoices}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          resetFilters={resetFilters}
          onCreateInvoice={handleCreateInvoice}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          PAGE_SIZE={PAGE_SIZE}
        />
      </div>

      <ClientForm
        open={isEditClientOpen}
        onClose={() => setIsEditClientOpen(false)}
        onSubmit={handleEditClient}
        initialData={client}
      />
    </Layout>
  );
};

export default ClientDetails;
