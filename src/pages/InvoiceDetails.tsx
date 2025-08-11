
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Send, 
  AlertCircle,
  FileWarning
} from "lucide-react";
import InvoicePreview from "@/components/invoices/InvoicePreview";
import { Client, Invoice } from "@/types";
import { format, parseISO } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import PageSEO from "@/components/seo/PageSEO";

// TODO: Fetch invoice and client data from backend in useEffect.

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<any>(null);
  const [client, setClient] = useState<any>(undefined);

  useEffect(() => {
    if (!id) return;
    
    // Future: Replace with real API call to getInvoice(id)
    // For now, try to load from localStorage as fallback
    const loadInvoiceData = async () => {
      try {
        const storedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
        const foundInvoice = storedInvoices.find((inv: any) => inv.id === id);
        
        if (foundInvoice) {
          setInvoice(foundInvoice);
          // Load client data if available
          // setClient(clientData); // TODO: Implement client loading
        }
      } catch (error) {
        toast({
          title: "Error loading invoice",
          description: "Failed to load invoice data",
          variant: "destructive",
        });
      }
    };
    
    loadInvoiceData();
  }, [id, toast]);

  const updateInvoiceStatus = (status: Invoice['status']) => {
    if (!invoice || !id) return;
    
    // Update local state
    setInvoice({
      ...invoice,
      status
    });
    
    // In a real app, this would send an API request to update the invoice status on the backend

    // Show toast notification
    const statusMessages = {
      paid: "Invoice marked as paid",
      pending: "Invoice marked as pending payment",
      sent: "Invoice marked as sent",
      overdue: "Invoice marked as overdue",
      draft: "Invoice status set to draft"
    };
    
    toast({
      title: statusMessages[status],
      description: `Invoice ${invoice.invoiceNumber} status updated successfully.`
    });
  };
  
  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 mr-2 text-yellow-500" />;
      case 'sent':
        return <Send className="w-4 h-4 mr-2 text-blue-500" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 mr-2 text-red-500" />;
      default:
        return <FileWarning className="w-4 h-4 mr-2 text-gray-500" />;
    }
  };
  
  const getStatusBadgeClass = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return "bg-green-100 text-green-800";
      case 'pending':
        return "bg-yellow-100 text-yellow-800";
      case 'sent':
        return "bg-blue-100 text-blue-800";
      case 'overdue':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  if (!invoice) {
    return (
      <Layout>
        <PageSEO
          title="Invoice Not Found | SparkInvoice"
          description="The invoice you're looking for doesn't exist."
          canonicalUrl={window.location.origin + "/invoices"}
        />
        <div className="animate-fade-in">
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <h2 className="text-xl font-semibold">Invoice not found</h2>
            <p className="text-muted-foreground mt-2">The invoice you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/invoices')} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Invoices
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Calculate roundoff value based on subtotal and gstAmount
  const calculateRoundoff = () => {
    if (!invoice) return 0;
    
    const exactTotal = parseFloat((invoice.subtotal + invoice.gstAmount).toFixed(2));
    const roundedTotal = Math.round(exactTotal);
    return parseFloat((roundedTotal - exactTotal).toFixed(2));
  };
  
  // Get roundoff value
  const roundoff = calculateRoundoff();
  
  return (
    <Layout>
      <PageSEO
        title={`Invoice ${invoice.invoiceNumber} | SparkInvoice`}
        description={`Status: ${invoice.status}`}
        canonicalUrl={window.location.origin + "/invoices/" + id}
      />
      <div className="animate-fade-in">
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
              {(() => {
                const invoiceDate = invoice.date instanceof Date ? invoice.date : (invoice.date ? new Date(invoice.date) : null);
                return invoiceDate && !isNaN(invoiceDate.getTime())
                  ? format(invoiceDate, "MMMM dd, yyyy")
                  : "No date available";
              })()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(invoice.status)}`}>
            {getStatusIcon(invoice.status)}
            <span>{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Change Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => updateInvoiceStatus('paid')}>
                <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> 
                Mark as Paid
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateInvoiceStatus('pending')}>
                <Clock className="w-4 h-4 mr-2 text-yellow-500" /> 
                Mark as Pending
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => updateInvoiceStatus('sent')}>
                <Send className="w-4 h-4 mr-2 text-blue-500" /> 
                Mark as Sent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateInvoiceStatus('overdue')}>
                <AlertCircle className="w-4 h-4 mr-2 text-red-500" /> 
                Mark as Overdue
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => updateInvoiceStatus('draft')}>
                <FileWarning className="w-4 h-4 mr-2 text-gray-500" /> 
                Set as Draft
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="space-y-6">
        {client && (
          <InvoicePreview 
            invoice={{
              ...invoice,
              status: invoice.status
            }}
            client={client}
            subtotal={invoice.subtotal}
            gstAmount={invoice.gstAmount}
            roundoff={roundoff}
            total={invoice.total}
          />
        )}
      </div>
      </div>
    </Layout>
  );
};

export default InvoiceDetails;
