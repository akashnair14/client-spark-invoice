
import Layout from "@/components/layout/Layout";
import ClientForm from "@/components/clients/ClientForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Client } from "@/types";
import { v4 as uuidv4 } from 'uuid';
import { mockClients } from "@/data/mockData";

const NewClient = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(true);

  const handleAddClient = (client: Omit<Client, "id">) => {
    const newClient = {
      ...client,
      id: uuidv4(),
    };
    
    // In a real app, this would be an API call
    // For now, we'll just simulate adding to the mock data
    mockClients.push(newClient);
    
    toast({
      title: "Client Added",
      description: `${client.companyName} has been added successfully.`,
    });
    
    navigate("/clients");
  };

  const handleClose = () => {
    navigate("/clients");
  };

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Add New Client</h1>
        <p className="page-description">Create a new client in your system</p>
      </div>
      
      <ClientForm
        open={isFormOpen}
        onClose={handleClose}
        onSubmit={handleAddClient}
      />
    </Layout>
  );
};

export default NewClient;
