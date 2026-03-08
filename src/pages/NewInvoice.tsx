
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
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
import { createInvoice, updateInvoice } from "@/api/invoices";
import { useQueryClient } from "@tanstack/react-query";
import PageSEO from "@/components/seo/PageSEO";

const NewInvoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (initialized) return;
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
        setInitialized(true);

        // Handle edit mode from URL params or location state
        const editId = searchParams.get("edit");
        const editInvoice = location.state?.editInvoice;
        const editClient = location.state?.editClient;
        const viewMode = location.state?.viewMode;

        if (editId && editInvoice && editClient) {
          const isView = viewMode || false;
          setIsEditMode(true);
          setIsViewMode(isView);
          setSelectedClient(editClient);
          setInvoiceData(editInvoice);
          calculateInvoiceTotals(editInvoice.items);
          
          if (isView) {
            setActiveTab("preview");
          }
          
          toast({
            title: isView ? "Invoice Loaded" : "Edit Mode",
            description: `Invoice ${editInvoice.invoiceNumber} ${isView ? 'loaded for viewing' : 'loaded for editing'}.`,
          });
        } else if (editId) {
          const storedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
          const invoiceToEdit = storedInvoices.find((inv: any) => inv.id === editId);
          
          if (invoiceToEdit) {
            const clientToEdit = data.find((c: any) => c.id === invoiceToEdit.clientId);
            if (clientToEdit) {
              setIsEditMode(true);
              setSelectedClient(mapClient(clientToEdit));
              setInvoiceData(invoiceToEdit);
              calculateInvoiceTotals(invoiceToEdit.items);
              
              toast({
                title: "Edit Mode",
                description: `Invoice ${invoiceToEdit.invoiceNumber} loaded for editing.`,
              });
            }
          } else {
            toast({
              title: "Invoice Not Found",
              description: "The invoice you're trying to edit could not be found.",
              variant: "destructive",
            });
            navigate('/invoices');
          }
        } else {
          const params = new URLSearchParams(location.search);
          const clientId = params.get("clientId");
          if (clientId) {
            const client = data.find((c: any) => c.id === clientId);
            if (client) setSelectedClient(mapClient(client));
          }
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
  }, [initialized]);

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

  const handleFinalizeInvoice = async () => {
    if (!invoiceData || !selectedClient) {
      toast({
        title: "Error",
        description: "Missing invoice or client data",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const invoicePayload = {
        invoice_number: invoiceData.invoiceNumber,
        client_id: selectedClient.id,
        date: invoiceData.date instanceof Date
          ? invoiceData.date.toISOString().split("T")[0]
          : invoiceData.date || new Date().toISOString().split("T")[0],
        due_date: invoiceData.dueDate instanceof Date
          ? invoiceData.dueDate.toISOString().split("T")[0]
          : invoiceData.dueDate || null,
        subtotal: subtotal,
        gst_amount: gstAmount,
        total: total,
        status: "sent" as const,
        notes: invoiceData.notes || null,
        gst_type: invoiceData.gstType === "igst" ? "inter-state" : "intra-state",
        po_number: invoiceData.poNumber || null,
        po_date: invoiceData.poDate instanceof Date
          ? invoiceData.poDate.toISOString().split("T")[0]
          : invoiceData.poDate || null,
        dc_number: invoiceData.dcNumber || null,
        dc_date: invoiceData.dcDate instanceof Date
          ? invoiceData.dcDate.toISOString().split("T")[0]
          : invoiceData.dcDate || null,
        challan_number: invoiceData.challanNumber || null,
        challan_date: invoiceData.challanDate instanceof Date
          ? invoiceData.challanDate.toISOString().split("T")[0]
          : invoiceData.challanDate || null,
        ewb_number: invoiceData.ewbNumber || null,
      };

      const itemsPayload = (invoiceData.items || []).map((item: any) => ({
        description: item.description,
        hsn_code: item.hsnCode || "",
        quantity: Number(item.quantity),
        rate: Number(item.rate),
        gst_rate: Number(item.gstRate || 0),
        cgst_rate: Number(item.cgstRate || 0),
        sgst_rate: Number(item.sgstRate || 0),
        amount: Number(item.amount || item.quantity * item.rate),
        invoice_id: "", // will be set by createInvoice
      }));

      if (isEditMode && invoiceData.id) {
        await updateInvoice(invoiceData.id, invoicePayload, itemsPayload);
        toast({
          title: "Invoice Updated",
          description: `Invoice ${invoiceData.invoiceNumber} has been updated successfully.`,
        });
      } else {
        await createInvoice(invoicePayload, itemsPayload);
        toast({
          title: "Invoice Saved",
          description: `Invoice ${invoiceData.invoiceNumber} has been saved and marked as sent.`,
        });
      }

      // Invalidate queries so lists refresh
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });

      // Navigate to invoices list
      navigate("/invoices");
    } catch (error: any) {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save invoice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
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

  const pageTitle = isEditMode 
    ? (isViewMode ? "View Invoice" : "Edit Invoice")
    : "Create New Invoice";
    
  const pageDescription = isEditMode
    ? (isViewMode ? "View and manage this invoice" : "Modify existing invoice details")
    : "Design and generate professional invoices with enhanced automation";

  return (
      <Layout>
        <PageSEO
          title={`${pageTitle} | SparkInvoice`}
          description={pageDescription}
          canonicalUrl={window.location.origin + "/invoices/new"}
        />
        <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{pageTitle}</h1>
        <p className="page-description">{pageDescription}</p>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <Card>
          <CardContent className="p-1">
            <TabsList className="grid w-full grid-cols-2 h-12">
              <TabsTrigger value="edit" className="h-10" disabled={isViewMode}>
                {isEditMode ? "Edit Invoice" : "Invoice Builder"}
              </TabsTrigger>
              <TabsTrigger value="preview" disabled={!invoiceData} className="h-10">
                Preview & {isViewMode ? "Print" : "Finalize"}
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
          {!isViewMode && (
            <InvoicePreviewActions
              onBackToEdit={() => setActiveTab("edit")}
              onFinalizeInvoice={handleFinalizeInvoice}
              hasInvoiceData={!!invoiceData}
            />
          )}

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
    </div>
    </Layout>
  );
};
export default NewInvoice;
