
import Layout from "@/components/layout/Layout";
import ClientForm from "@/components/clients/ClientForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Client } from "@/types";
import { createClient } from "@/api/clients";
import { getCurrentUserId } from "@/utils/authUtils";
import PageSEO from "@/components/seo/PageSEO";

// Utility function to convert Client form values to snake_case for Supabase
function mapClientToDbInput(client: Omit<Client, "id">, ownerId: string) {
  return {
    owner_id: ownerId,
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
    // last_invoice_date, total_invoiced, pending_invoices, fy_invoices are optional and not part of the form
  };
}

const NewClient = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(true);

  const handleAddClient = async (client: Omit<Client, "id">) => {
    try {
      // Get the current authenticated user's ID
      const ownerId = await getCurrentUserId();
      
      // Use the authenticated user's ID as owner_id
      const dbInput = mapClientToDbInput(client, ownerId);
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
      <PageSEO
        title="Add Client | SparkInvoice"
        description="Create a new client in your system."
        canonicalUrl={window.location.origin + "/clients/new"}
      />
      <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Add New Client</h1>
        <p className="page-description">Create a new client in your system</p>
      </div>

      <ClientForm open={isFormOpen} onClose={handleClose} onSubmit={handleAddClient} />
      </div>
    </Layout>
  );
};

export default NewClient;
