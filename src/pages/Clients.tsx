
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ClientTable from "@/components/clients/ClientTable";
import ClientForm from "@/components/clients/ClientForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Client } from "@/types";
import { mockClients } from "@/data/mockData";
import { v4 as uuidv4 } from 'uuid';

const Clients = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Add sample tags and status to mock clients
  const enhancedClients: Client[] = mockClients.map((client, index) => ({
    ...client,
    tags: index === 0 ? ["frequent", "vip"] : index === 1 ? ["delayed payer"] : index === 2 ? ["new", "priority"] : ["frequent"],
    status: index === 0 ? "active" : index === 1 ? "pending" : "active",
  })) as Client[];

  const [clients, setClients] = useState<Client[]>(enhancedClients);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | undefined>(undefined);

  const handleEditClient = (client: Omit<Client, "id">) => {
    if (!currentClient) return;

    const updatedClient = {
      ...client,
      id: currentClient.id,
    };
    setClients(clients.map((c) => (c.id === currentClient.id ? updatedClient : c)));
    toast({
      title: "Client Updated",
      description: `${client.companyName} has been updated successfully.`,
    });
    
    // Clean up edit state
    setIsEditClientOpen(false);
    setCurrentClient(undefined);
  };

  const handleDeleteClient = (client: Client) => {
    setClients(clients.filter((c) => c.id !== client.id));
    toast({
      title: "Client Deleted",
      description: `${client.companyName} has been deleted.`,
    });
  };

  const handleCreateInvoice = (client: Client) => {
    navigate(`/invoices/new?clientId=${client.id}`);
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

        <ClientTable
          clients={clients}
          onEdit={(client) => {
            setCurrentClient(client);
            setIsEditClientOpen(true);
          }}
          onDelete={handleDeleteClient}
          onCreateInvoice={handleCreateInvoice}
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
      </div>
    </Layout>
  );
};

export default Clients;
