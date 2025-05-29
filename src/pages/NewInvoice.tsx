
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
import { Invoice } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

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
    const client = mockClients.find(c => c.id === formData.clientId);
    
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
    const autoStatus = isComplete ? 'pending' as const : 'draft' as const;
    
    const newInvoice: Invoice = {
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
            clients={mockClients}
            onSubmit={handleInvoiceSubmit}
            initialClientId={selectedClient?.id}
          />
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-6 mt-6">
          <InvoicePreviewActions
            onBackToEdit={() => setActiveTab("edit")}
            onSaveInvoice={handleSaveInvoice}
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
