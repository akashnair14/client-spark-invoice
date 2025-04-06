
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  // In a real app, this would be replaced with API calls and React Query
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | undefined>(undefined);

  const handleAddClient = (client: Omit<Client, "id">) => {
    const newClient = {
      ...client,
      id: uuidv4(),
    };
    setClients([...clients, newClient]);
    toast({
      title: "Client Added",
      description: `${client.companyName} has been added successfully.`,
    });
  };

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
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Clients</h1>
          <p className="page-description">Manage your client information</p>
        </div>
        <Button onClick={() => setIsAddClientOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Client
        </Button>
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
        open={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
        onSubmit={handleAddClient}
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
    </Layout>
  );
};

export default Clients;
