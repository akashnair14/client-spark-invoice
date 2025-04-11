
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import InvoiceForm from "@/components/invoices/InvoiceForm";
import InvoicePreview from "@/components/invoices/InvoicePreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Client, Invoice, InvoiceItem } from "@/types";
import { mockClients, mockInvoices } from "@/data/mockData";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Save } from "lucide-react";

const NewInvoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("edit");
  const [selectedClient, setSelectedClient] = useState<Client | undefined>(undefined);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [subtotal, setSubtotal] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
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
    // Calculate totals
    const items: InvoiceItem[] = formData.items.map((item: any) => ({
      ...item,
      amount: item.quantity * item.rate
    }));

    const newSubtotal = items.reduce((sum: number, item: InvoiceItem) => sum + item.amount, 0);
    const newGstAmount = items.reduce((sum: number, item: InvoiceItem) => sum + (item.amount * item.gstRate / 100), 0);
    const newTotal = newSubtotal + newGstAmount;

    // Create a new invoice object
    const newInvoice: Invoice = {
      id: uuidv4(),
      clientId: formData.clientId,
      invoiceNumber: formData.invoiceNumber,
      date: formData.date.toISOString().split('T')[0], // Format date
      dueDate: formData.dueDate.toISOString().split('T')[0], // Format date
      items,
      subtotal: newSubtotal,
      gstAmount: newGstAmount,
      total: newTotal,
      status: 'draft',
      notes: formData.notes
    };

    // Update state
    setInvoiceData({
      ...formData,
      date: formData.date,
      dueDate: formData.dueDate,
    });
    setSelectedClient(mockClients.find(client => client.id === formData.clientId));
    setSubtotal(newSubtotal);
    setGstAmount(newGstAmount);
    setTotal(newTotal);
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
    // Here you would typically save the invoice to your database
    toast({
      title: "Invoice Saved",
      description: `Invoice ${invoiceData.invoiceNumber} has been saved successfully.`,
      variant: "default",
    });
    
    // Navigate back to invoices list after short delay
    setTimeout(() => {
      navigate("/invoices");
    }, 1500);
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
