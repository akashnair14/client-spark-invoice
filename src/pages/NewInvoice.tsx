
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import InvoiceForm from "@/components/invoices/InvoiceForm";
import InvoicePreview from "@/components/invoices/InvoicePreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockClients, mockInvoices } from "@/data/mockData";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";
import { useInvoiceState } from "@/hooks/useInvoiceState";
import InvoicePreviewActions from "@/components/invoices/form/InvoicePreviewActions";
import InvoicePreviewPlaceholder from "@/components/invoices/form/InvoicePreviewPlaceholder";

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
    calculateInvoiceTotals
  } = useInvoiceState();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const clientId = params.get("clientId");

    if (clientId) {
      const client = mockClients.find((c) => c.id === clientId);
      if (client) {
        setSelectedClient(client);
      }
    }
  }, [location, setSelectedClient]);

  const handleInvoiceSubmit = (formData: any) => {
    const items = formData.items.map((item: any) => ({
      ...item,
      amount: item.quantity * item.rate
    }));

    calculateInvoiceTotals(items);
    
    setInvoiceData({
      ...formData,
      items,
    });
    setActiveTab("preview");

    toast({
      title: "Invoice Generated",
      description: `Invoice ${formData.invoiceNumber} has been created successfully.`,
    });
  };

  const handleSaveInvoice = () => {
    if (!invoiceData || !selectedClient) return;
    
    const isComplete = validateInvoiceCompleteness(invoiceData, selectedClient);
    const autoStatus = isComplete ? 'pending' : 'draft';
    
    const newInvoice = {
      id: uuidv4(),
      clientId: selectedClient.id,
      invoiceNumber: invoiceData.invoiceNumber,
      date: invoiceData.date.toISOString().split('T')[0],
      items: invoiceData.items,
      subtotal,
      gstAmount,
      total,
      status: autoStatus,
      notes: invoiceData.notes || "",
      gstType: invoiceData.gstType,
      challanNumber: invoiceData.challanNumber,
      challanDate: invoiceData.challanDate,
      poNumber: invoiceData.poNumber,
      poDate: invoiceData.poDate,
      dcNumber: invoiceData.dcNumber,
      dcDate: invoiceData.dcDate,
      ewbNumber: invoiceData.ewbNumber
    };

    mockInvoices.push(newInvoice);
    
    toast({
      title: "Invoice Saved",
      description: `Invoice ${invoiceData.invoiceNumber} has been saved as ${autoStatus.toUpperCase()}.`,
      variant: "default",
    });
    
    setTimeout(() => {
      navigate("/invoices");
    }, 1500);
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
        <h1 className="page-title">New Invoice</h1>
        <p className="page-description">Create and preview a new invoice</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="edit">Edit Invoice</TabsTrigger>
          <TabsTrigger value="preview" disabled={!invoiceData}>Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="space-y-4">
          <InvoiceForm
            clients={mockClients}
            onSubmit={handleInvoiceSubmit}
            initialClientId={selectedClient?.id}
          />
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-4">
          <InvoicePreviewActions
            onBackToEdit={() => setActiveTab("edit")}
            onSaveInvoice={handleSaveInvoice}
            hasInvoiceData={!!invoiceData}
          />

          {invoiceData ? (
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
