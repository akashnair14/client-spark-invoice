
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { mockInvoices, mockClients } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import InvoicePreview from "@/components/invoices/InvoicePreview";
import { Client } from "@/types";
import { format, parseISO } from "date-fns";

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any>(null);
  const [client, setClient] = useState<Client | undefined>(undefined);
  
  useEffect(() => {
    if (!id) return;
    
    const foundInvoice = mockInvoices.find(invoice => invoice.id === id);
    if (foundInvoice) {
      setInvoice({
        ...foundInvoice,
        date: parseISO(foundInvoice.date),
        dueDate: parseISO(foundInvoice.dueDate),
      });
      
      const foundClient = mockClients.find(client => client.id === foundInvoice.clientId);
      if (foundClient) {
        setClient(foundClient);
      }
    }
  }, [id]);
  
  if (!invoice) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-xl font-semibold">Invoice not found</h2>
          <p className="text-muted-foreground mt-2">The invoice you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/invoices')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Invoices
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="page-header flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon" 
            className="mr-4" 
            onClick={() => navigate('/invoices')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="page-title">Invoice {invoice.invoiceNumber}</h1>
            <p className="page-description text-sm text-muted-foreground">
              {format(invoice.date, "MMMM dd, yyyy")}
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        {client && (
          <InvoicePreview 
            invoice={invoice}
            client={client}
            subtotal={invoice.subtotal}
            gstAmount={invoice.gstAmount}
            total={invoice.total}
          />
        )}
      </div>
    </Layout>
  );
};

export default InvoiceDetails;
