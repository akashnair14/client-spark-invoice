
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import InvoiceForm from "@/components/invoices/InvoiceForm";
import InvoicePreview from "@/components/invoices/InvoicePreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useInvoiceState } from "@/hooks/useInvoiceState";
import InvoicePreviewActions from "@/components/invoices/form/InvoicePreviewActions";
import InvoicePreviewPlaceholder from "@/components/invoices/form/InvoicePreviewPlaceholder";
import { Invoice, Client } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { getClients } from "@/api/clients";

const NewInvoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    activeTab,
    setActiveTab,
    selectedClient,
    setSelectedClient,
    invoiceData,
    setInvoiceData,
    subtotal,
    gstAmount,
    roundoff,
    total,
    calculateInvoiceTotals,
  } = useInvoiceState();

  const [clients, setClients] = useState<Client[]>([]);
  const [clientsLoading, setClientsLoading] = useState(true);

  useEffect(() => {
    setClientsLoading(true);
    getClients()
      .then((data) => {
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
        setClientsLoading(false);

        // auto-select client if clientId param is present
        const params = new URLSearchParams(location.search);
        const clientId = params.get("clientId");
        if (clientId) {
          const client = data.find((c: any) => c.id === clientId);
          if (client) setSelectedClient(mapClient(client));
        }
      })
      .catch((err) => {
        setClientsLoading(false);
        toast({
          title: "Failed to load clients",
          description: err.message,
          variant: "destructive",
        });
      });
  }, [location, setSelectedClient]);

  const handleInvoiceSubmit = (formData: any) => {
    const client = clients.find((c) => c.id === formData.clientId);

    if (!client) {
      toast({
        title: "Error",
        description: "Please select a valid client",
        variant: "destructive",
      });
      return;
    }

    setSelectedClient(client);

    const items = formData.items.map((item: any) => ({
      ...item,
      amount: item.quantity * item.rate,
    }));

    calculateInvoiceTotals(items);

    setInvoiceData({
      ...formData,
      items,
    });
    setActiveTab("preview");

    toast({
      title: "Invoice Generated",
      description: `Invoice ${formData.invoiceNumber} preview is ready.`,
    });
  };

  const handleFinalizeInvoice = () => {
    if (!invoiceData || !selectedClient) {
      toast({
        title: "Error",
        description: "Missing invoice or client data",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update invoice status to 'sent' in localStorage
      const existingInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
      const updatedInvoices = existingInvoices.map((inv: any) => 
        inv.invoiceNumber === invoiceData.invoiceNumber 
          ? { ...inv, status: 'sent', lastStatusUpdate: new Date().toISOString() }
          : inv
      );
      localStorage.setItem('invoices', JSON.stringify(updatedInvoices));

      toast({
        title: "Invoice Finalized",
        description: `Invoice ${invoiceData.invoiceNumber} has been finalized and marked as sent.`,
      });

      // Don't auto-close, let user decide when to leave
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to finalize invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const validateInvoiceCompleteness = (invoice: any, client: any): boolean => {
    const clientComplete = client && 
                          client.companyName && 
                          client.address && 
                          client.gstNumber;
    
    const itemsComplete = invoice.items && 
                          invoice.items.length > 0 && 
                          invoice.items.every((item: any) => 
                            item.description && 
                            item.quantity > 0 && 
                            item.rate > 0 && 
                            item.hsnCode);
    
    const invoiceDetailsComplete = invoice.invoiceNumber && 
                                   invoice.date;
    
    return clientComplete && itemsComplete && invoiceDetailsComplete;
  };

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Create New Invoice</h1>
        <p className="page-description">Design and generate professional invoices with enhanced automation</p>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <Card>
          <CardContent className="p-1">
            <TabsList className="grid w-full grid-cols-2 h-12">
              <TabsTrigger value="edit" className="h-10">
                Invoice Builder
              </TabsTrigger>
              <TabsTrigger value="preview" disabled={!invoiceData} className="h-10">
                Preview & Finalize
              </TabsTrigger>
            </TabsList>
          </CardContent>
        </Card>

        <TabsContent value="edit" className="space-y-6 mt-6">
          <InvoiceForm
            clients={clients}
            onSubmit={handleInvoiceSubmit}
            initialClientId={selectedClient?.id}
          />
        </TabsContent>

        <TabsContent value="preview" className="space-y-6 mt-6">
          <InvoicePreviewActions
            onBackToEdit={() => setActiveTab("edit")}
            onFinalizeInvoice={handleFinalizeInvoice}
            hasInvoiceData={!!invoiceData}
          />

          {invoiceData && selectedClient ? (
            <InvoicePreview
              invoice={invoiceData}
              client={selectedClient}
              subtotal={subtotal}
              gstAmount={gstAmount}
              roundoff={roundoff}
              total={total}
            />
          ) : (
            <InvoicePreviewPlaceholder />
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
};
export default NewInvoice;
