import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import InvoiceForm from "@/components/invoices/InvoiceForm";
import InvoicePreview from "@/components/invoices/InvoicePreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Client, Invoice, InvoiceItem } from "@/types";
import { mockClients, mockInvoices } from "@/data/mockData";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Save } from "lucide-react";
import { calculateSubtotal, calculateGstAmount, calculateRoundoff, calculateTotalAmount } from "@/utils/invoiceUtils";

const NewInvoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("edit");
  const [selectedClient, setSelectedClient] = useState<Client | undefined>(undefined);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [subtotal, setSubtotal] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [roundoff, setRoundoff] = useState(0);
  const [total, setTotal] = useState(0);

  // Get client ID from query params if provided
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const clientId = params.get("clientId");

    if (clientId) {
      const client = mockClients.find((c) => c.id === clientId);
      if (client) {
        setSelectedClient(client);
      }
    }
  }, [location]);

  const handleInvoiceSubmit = (formData: any) => {
    // Update items to ensure amounts are calculated correctly
    const items: InvoiceItem[] = formData.items.map((item: any) => ({
      ...item,
      amount: item.quantity * item.rate
    }));

    // Calculate totals using utility functions
    const newSubtotal = calculateSubtotal(items);
    const newGstAmount = calculateGstAmount(items);
    const newRoundoff = calculateRoundoff(newSubtotal, newGstAmount);
    const newTotal = calculateTotalAmount(items);

    // Update state with calculated values
    setSubtotal(newSubtotal);
    setGstAmount(newGstAmount);
    setRoundoff(newRoundoff);
    setTotal(newTotal);
    
    // Set invoice data and client
    setInvoiceData({
      ...formData,
      items,
      date: formData.date,
      gstType: formData.gstType,
      challanNumber: formData.challanNumber,
      challanDate: formData.challanDate,
      poNumber: formData.poNumber,
      poDate: formData.poDate,
      dcNumber: formData.dcNumber,
      dcDate: formData.dcDate,
      ewbNumber: formData.ewbNumber
    });
    setSelectedClient(mockClients.find(client => client.id === formData.clientId));
    
    // Switch to preview tab
    setActiveTab("preview");

    // Show success toast
    toast({
      title: "Invoice Generated",
      description: `Invoice ${formData.invoiceNumber} has been created successfully.`,
    });
  };

  const handleBackToEdit = () => {
    setActiveTab("edit");
  };

  const handleSaveInvoice = () => {
    if (!invoiceData || !selectedClient) return;
    
    // Determine invoice status automatically based on required fields
    const isComplete = validateInvoiceCompleteness(invoiceData, selectedClient);
    const autoStatus = isComplete ? 'pending' : 'draft';
    
    // Create a new invoice object to be saved
    const newInvoice: Invoice = {
      id: uuidv4(),
      clientId: selectedClient.id,
      invoiceNumber: invoiceData.invoiceNumber,
      date: invoiceData.date.toISOString().split('T')[0], // Format date
      items: invoiceData.items,
      subtotal: subtotal,
      gstAmount: gstAmount,
      total: total,
      status: autoStatus,
      notes: invoiceData.notes || "",
      // Additional fields
      gstType: invoiceData.gstType,
      challanNumber: invoiceData.challanNumber,
      challanDate: invoiceData.challanDate,
      poNumber: invoiceData.poNumber,
      poDate: invoiceData.poDate,
      dcNumber: invoiceData.dcNumber,
      dcDate: invoiceData.dcDate,
      ewbNumber: invoiceData.ewbNumber
    };

    // In a real app, this would save to a database
    // For now we'll add it to the mockInvoices array
    mockInvoices.push(newInvoice);
    
    toast({
      title: "Invoice Saved",
      description: `Invoice ${invoiceData.invoiceNumber} has been saved as ${autoStatus.toUpperCase()}.`,
      variant: "default",
    });
    
    // Navigate back to invoices list after short delay
    setTimeout(() => {
      navigate("/invoices");
    }, 1500);
  };

  // Function to validate if all necessary details are filled
  const validateInvoiceCompleteness = (invoice: any, client: Client): boolean => {
    // Check if client details are complete
    const clientComplete = client && 
                          client.companyName && 
                          client.address && 
                          client.gstNumber;
    
    // Check if invoice has valid items
    const itemsComplete = invoice.items && 
                          invoice.items.length > 0 && 
                          invoice.items.every((item: InvoiceItem) => 
                            item.description && 
                            item.quantity > 0 && 
                            item.rate > 0 && 
                            item.hsnCode);
    
    // Check if basic invoice details are complete
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
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" onClick={handleBackToEdit}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Edit
            </Button>
            {invoiceData && (
              <Button variant="default" onClick={handleSaveInvoice}>
                <Save className="h-4 w-4 mr-2" /> Save Invoice
              </Button>
            )}
          </div>

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
            <div className="text-center py-10 border rounded-lg bg-muted/20">
              <Eye className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Preview Available</h3>
              <p className="text-muted-foreground mt-2">Please create an invoice first</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default NewInvoice;
