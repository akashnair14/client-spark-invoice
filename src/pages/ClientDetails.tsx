import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Client } from "@/types";
import ClientForm from "@/components/clients/ClientForm";
import { useToast } from "@/components/ui/use-toast";
import ClientInfoCard from "@/components/clients/ClientInfoCard";
import ClientInvoicesCard from "@/components/clients/ClientInvoicesCard";
import { getClient, updateClient, deleteClient as apiDeleteClient } from "@/api/clients";
import { getInvoices } from "@/api/invoices";
import { mapDbClient, clientToDbFields } from "@/utils/transformers";
import { Skeleton } from "@/components/ui/skeleton";
import PageSEO from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [clientInvoices, setClientInvoices] = useState<any[]>([]);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [currentYearInvoices, setCurrentYearInvoices] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const PAGE_SIZE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMonth, selectedYear, clientInvoices]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    getClient(id)
      .then(async (data) => {
        setClient(mapDbClient(data));
        setLoading(false);

        const allInvoices = await getInvoices();
        const clientInvs = allInvoices
          .filter((inv: any) => inv.client_id === id)
          .map((inv: any) => ({
            id: inv.id,
            invoiceNumber: inv.invoice_number,
            clientId: inv.client_id,
            date: inv.date,
            dueDate: inv.due_date,
            status: inv.status,
            subtotal: Number(inv.subtotal),
            gstAmount: Number(inv.gst_amount),
            total: Number(inv.total),
            amount: Number(inv.total),
          }));
        setClientInvoices(clientInvs);

        const today = new Date();
        const currentYear = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
        const startDate = new Date(`${currentYear}-04-01`);
        const endDate = new Date(`${currentYear + 1}-03-31`);
        const fyInvs = clientInvs.filter((inv: any) => {
          const d = new Date(inv.date);
          return d >= startDate && d <= endDate;
        });
        setCurrentYearInvoices(fyInvs);
      })
      .catch(() => {
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
        <div className="space-y-6 p-1">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded" />
            <div>
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl md:col-span-2" />
          </div>
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
          <Button variant="outline" className="mt-4" onClick={() => navigate('/clients')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Clients
          </Button>
        </div>
      </Layout>
    );
  }

  const handleEditClient = async (updatedClient: Omit<Client, "id">) => {
    if (!id) return;
    try {
      await updateClient(id, clientToDbFields(updatedClient));
      setClient({ ...client, ...updatedClient });
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

  const confirmDeleteClient = async () => {
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
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const handleCreateInvoice = () => {
    navigate(`/invoices/new?clientId=${client.id}`);
  };

  return (
    <Layout>
      <PageSEO
        title={`${client.companyName} | Client Details | SparkInvoice`}
        description={`Profile and invoices for ${client.companyName}`}
        canonicalUrl={window.location.origin + "/clients/" + client.id}
      />
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={() => navigate('/clients')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">{client.companyName}</h1>
            <p className="text-sm text-muted-foreground">Client profile and details</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <ClientInfoCard
            client={client}
            currentYearInvoicesCount={currentYearInvoices.length}
            onCreateInvoice={handleCreateInvoice}
            onEdit={() => setIsEditClientOpen(true)}
            onDelete={() => setShowDeleteDialog(true)}
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

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Client</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <span className="font-semibold">{client.companyName}</span>? This will also affect associated invoices.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteClient} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default ClientDetails;
