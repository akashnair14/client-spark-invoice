
import { useState } from "react";
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
import { mockClients } from "@/data/mockData";

const Clients = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Add sample tags and status to mock clients
  const enhancedClients: Client[] = mockClients.map((client, index) => ({
    ...client,
    tags: index === 0 ? ["frequent", "vip"] : index === 1 ? ["delayed payer"] : index === 2 ? ["new", "priority"] : ["frequent"],
    status: index === 0 ? "active" : index === 1 ? "pending" : "active",
    lastInvoiceDate: index === 0 ? "2024-01-15" : index === 1 ? "2023-12-20" : undefined,
    totalInvoiced: index === 0 ? 125000 : index === 1 ? 85000 : 45000,
    pendingInvoices: index === 0 ? 2 : index === 1 ? 1 : 0,
    fyInvoices: index === 0 ? 8 : index === 1 ? 6 : 3,
  })) as Client[];

  const [clients, setClients] = useState<Client[]>(enhancedClients);
  const [filteredClients, setFilteredClients] = useState<Client[]>(enhancedClients);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | undefined>(undefined);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [detailsClient, setDetailsClient] = useState<Client | undefined>(undefined);

  const handleEditClient = (client: Omit<Client, "id">) => {
    if (!currentClient) return;

    const updatedClient = {
      ...client,
      id: currentClient.id,
    };
    
    const updatedClients = clients.map((c) => (c.id === currentClient.id ? updatedClient : c));
    setClients(updatedClients);
    setFilteredClients(updatedClients);
    
    toast({
      title: "Client Updated",
      description: `${client.companyName} has been updated successfully.`,
    });
    
    setIsEditClientOpen(false);
    setCurrentClient(undefined);
  };

  const handleDeleteClient = (client: Client) => {
    const updatedClients = clients.filter((c) => c.id !== client.id);
    setClients(updatedClients);
    setFilteredClients(updatedClients);
    setSelectedClients(selectedClients.filter(id => id !== client.id));
    
    toast({
      title: "Client Deleted",
      description: `${client.companyName} has been deleted.`,
    });
  };

  const handleBulkDelete = (clientIds: string[]) => {
    const updatedClients = clients.filter((c) => !clientIds.includes(c.id));
    setClients(updatedClients);
    setFilteredClients(updatedClients);
    setSelectedClients([]);
  };

  const handleCreateInvoice = (client: Client) => {
    navigate(`/invoices/new?clientId=${client.id}`);
  };

  const handleViewDetails = (client: Client) => {
    setDetailsClient(client);
    setIsDetailsDrawerOpen(true);
  };

  const handleFilter = (searchTerm: string, statusFilter: string, stateFilter: string, tagFilter: string) => {
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
      filtered = filtered.filter((client) => 
        client.tags && client.tags.includes(tagFilter)
      );
    }

    setFilteredClients(filtered);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="page-header flex items-center justify-between">
          <div>
            <h1 className="page-title">Clients</h1>
            <p className="page-description">Manage your client information and relationships</p>
          </div>
          <Link to="/clients/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Client
            </Button>
          </Link>
        </div>

        <ClientFilters
          clients={clients}
          onFilter={handleFilter}
        />

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
