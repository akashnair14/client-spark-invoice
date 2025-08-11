
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ClientTable from "@/components/clients/ClientTable";
import ClientForm from "@/components/clients/ClientForm";
import ClientDetailsDrawer from "@/components/clients/ClientDetailsDrawer";
import ClientFilters from "@/components/clients/ClientFilters";
import BulkActions from "@/components/clients/BulkActions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Client } from "@/types";
import {
  getClients,
  updateClient,
  deleteClient as apiDeleteClient,
} from "@/api/clients";
import PageSEO from "@/components/seo/PageSEO";

const Clients = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | undefined>(
    undefined
  );
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [detailsClient, setDetailsClient] = useState<Client | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getClients()
      .then((data) => {
        // Transform DB schema to Client type
        const mapClient = (c: any): Client => ({
          id: c.id,
          companyName: c.company_name,
          contactName: c.contact_name ?? "",
          gstNumber: c.gst_number ?? "",
          phoneNumber: c.phone_number ?? "",
          phone: c.phone_number ?? "",
          email: c.email ?? "",
          bankAccountNumber: c.bank_account_number ?? "",
          bankDetails: c.bank_details ?? "",
          address: c.address ?? "",
          city: c.city ?? "",
          state: c.state ?? "",
          postalCode: c.postal_code ?? "",
          website: c.website ?? "",
          tags: c.tags ?? [],
          status: c.status as any,
          lastInvoiceDate: c.last_invoice_date ?? undefined,
          totalInvoiced: c.total_invoiced ?? undefined,
          pendingInvoices: c.pending_invoices ?? undefined,
          fyInvoices: c.fy_invoices ?? undefined,
        });
        setClients(data.map(mapClient));
        setFilteredClients(data.map(mapClient));
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast({
          title: "Failed to load clients",
          description: err.message,
          variant: "destructive",
        });
      });
  }, []);

  const handleEditClient = async (client: Omit<Client, "id">) => {
    if (!currentClient) return;
    try {
      // Only send snake_case keys to Supabase
      const updates = {
        company_name: client.companyName,
        contact_name: client.contactName,
        gst_number: client.gstNumber,
        phone_number: client.phoneNumber,
        bank_account_number: client.bankAccountNumber,
        bank_details: client.bankDetails,
        address: client.address,
        city: client.city,
        state: client.state,
        postal_code: client.postalCode,
        website: client.website,
        tags: client.tags,
        status: client.status,
        email: client.email,
      };
      await updateClient(currentClient.id, updates);
      setClients((prev) =>
        prev.map((c) => (c.id === currentClient.id ? { ...c, ...client } : c))
      );
      setFilteredClients((prev) =>
        prev.map((c) => (c.id === currentClient.id ? { ...c, ...client } : c))
      );
      toast({
        title: "Client Updated",
        description: `${client.companyName} has been updated successfully.`,
      });
      setIsEditClientOpen(false);
      setCurrentClient(undefined);
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteClient = async (client: Client) => {
    try {
      await apiDeleteClient(client.id);
      setClients((prev) => prev.filter((c) => c.id !== client.id));
      setFilteredClients((prev) => prev.filter((c) => c.id !== client.id));
      setSelectedClients((prev) => prev.filter((id) => id !== client.id));
      toast({
        title: "Client Deleted",
        description: `${client.companyName} has been deleted.`,
      });
    } catch (err: any) {
      toast({
        title: "Delete Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async (clientIds: string[]) => {
    try {
      await Promise.all(
        clientIds.map((id) =>
          apiDeleteClient(id).catch((err) => {
            toast({
              title: "Delete Failed",
              description: `Could not delete some clients: ${err.message}`,
              variant: "destructive",
            });
          })
        )
      );
      setClients((prev) => prev.filter((c) => !clientIds.includes(c.id)));
      setFilteredClients((prev) => prev.filter((c) => !clientIds.includes(c.id)));
      setSelectedClients([]);
    } catch (err: any) {
      toast({
        title: "Bulk Delete Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleCreateInvoice = (client: Client) => {
    navigate(`/invoices/new?clientId=${client.id}`);
  };

  const handleViewDetails = (client: Client) => {
    setDetailsClient(client);
    setIsDetailsDrawerOpen(true);
  };

  const handleFilter = (
    searchTerm: string,
    statusFilter: string,
    stateFilter: string,
    tagFilter: string
  ) => {
    let filtered = clients;

    if (searchTerm) {
      filtered = filtered.filter(
        (client) =>
          client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.gstNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((client) => client.status === statusFilter);
    }

    if (stateFilter && stateFilter !== "all") {
      filtered = filtered.filter((client) => client.state === stateFilter);
    }

    if (tagFilter && tagFilter !== "all") {
      filtered = filtered.filter(
        (client) => client.tags && client.tags.includes(tagFilter)
      );
    }

    setFilteredClients(filtered);
  };

  // Optionally show spinner/skeletons for loading
  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-xl font-semibold">Loading clients…</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageSEO
        title="Clients | SparkInvoice"
        description="Manage your client information and relationships."
        canonicalUrl={window.location.origin + "/clients"}
      />
      <div className="space-y-6 animate-fade-in">
        <div className="page-header flex items-center justify-between">
          <div>
            <h1 className="page-title">Clients</h1>
            <p className="page-description">
              Manage your client information and relationships
            </p>
          </div>
          <Link to="/clients/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Client
            </Button>
          </Link>
        </div>

        <ClientFilters clients={clients} onFilter={handleFilter} />

        <BulkActions
          selectedClients={selectedClients}
          onSelectionChange={setSelectedClients}
          clients={filteredClients}
          onBulkDelete={handleBulkDelete}
        />

        <ClientTable
          clients={filteredClients}
          onEdit={(client) => {
            setCurrentClient(client);
            setIsEditClientOpen(true);
          }}
          onDelete={handleDeleteClient}
          onCreateInvoice={handleCreateInvoice}
          onViewDetails={handleViewDetails}
          selectedClients={selectedClients}
          onSelectionChange={setSelectedClients}
        />

        <ClientForm
          open={isEditClientOpen}
          onClose={() => {
            setIsEditClientOpen(false);
            setCurrentClient(undefined);
          }}
          onSubmit={handleEditClient}
          initialData={currentClient}
        />

        <ClientDetailsDrawer
          open={isDetailsDrawerOpen}
          onClose={() => {
            setIsDetailsDrawerOpen(false);
            setDetailsClient(undefined);
          }}
          client={detailsClient}
        />
      </div>
    </Layout>
  );
};

export default Clients;

