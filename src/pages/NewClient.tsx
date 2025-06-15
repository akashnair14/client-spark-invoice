
import Layout from "@/components/layout/Layout";
import ClientForm from "@/components/clients/ClientForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Client } from "@/types";
import { createClient } from "@/api/clients";

const NewClient = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(true);

  const handleAddClient = async (client: Omit<Client, "id">) => {
    try {
      // owner_id is REQUIRED, should be passed appropriately from session context or set in the API endpoint.
      // For now, fake owner_id for demo; replace with real one when available.
      const owner_id = "demo-owner-id"; // TODO: Replace with supabase.auth.currentUser?.id
      const dbInput = {
        ...client,
        owner_id,
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
      await createClient(dbInput);
      toast({
        title: "Client Added",
        description: `${client.companyName} has been added successfully.`,
      });
      navigate("/clients");
    } catch (error: any) {
      toast({
        title: "Add Client Failed",
        description: error.message,
        variant: "destructive",
      });
    }
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

      <ClientForm open={isFormOpen} onClose={handleClose} onSubmit={handleAddClient} />
    </Layout>
  );
};

export default NewClient;

