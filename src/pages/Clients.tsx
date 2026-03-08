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
import { mapDbClient, clientToDbFields } from "@/utils/transformers";
import PageSEO from "@/components/seo/PageSEO";
import { Skeleton } from "@/components/ui/skeleton";
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

const Clients = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | undefined>(undefined);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [detailsClient, setDetailsClient] = useState<Client | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);

  useEffect(() => {
    setLoading(true);
    getClients()
      .then((data) => {
        const mapped = data.map(mapDbClient);
        setClients(mapped);
        setFilteredClients(mapped);
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
      await updateClient(currentClient.id, clientToDbFields(client));
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

  const confirmDeleteClient = async () => {
    if (!deleteTarget) return;
    try {
      await apiDeleteClient(deleteTarget.id);
      setClients((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setFilteredClients((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setSelectedClients((prev) => prev.filter((id) => id !== deleteTarget.id));
      toast({
        title: "Client Deleted",
        description: `${deleteTarget.companyName} has been deleted.`,
      });
    } catch (err: any) {
      toast({
        title: "Delete Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleDeleteClient = (client: Client) => {
    setDeleteTarget(client);
  };

  const handleBulkDelete = async (clientIds: string[]) => {
    try {
      await Promise.all(clientIds.map((id) => apiDeleteClient(id)));
      setClients((prev) => prev.filter((c) => !clientIds.includes(c.id)));
      setFilteredClients((prev) => prev.filter((c) => !clientIds.includes(c.id)));
      setSelectedClients([]);
      toast({ title: "Clients Deleted", description: `${clientIds.length} client(s) deleted.` });
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

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6 p-1">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-28" />
          </div>
          <Skeleton className="h-10 w-full" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
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
      <div className="space-y-4 md:space-y-6 animate-fade-in">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">Clients</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage your client information and relationships ({filteredClients.length})
            </p>
          </div>
          <Link to="/clients/new">
            <Button className="gap-2 shadow-sm">
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

        {/* Delete confirmation dialog */}
        <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Client</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <span className="font-semibold">{deleteTarget?.companyName}</span>? This action cannot be undone and will remove all associated data.
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

export default Clients;
