import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Client } from "@/types";
import { mockClients, mockInvoices } from "@/data/mockData";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  FileText,
  Trash2, 
  Edit,
  ArrowLeft,
  Receipt
} from "lucide-react";
import ClientForm from "@/components/clients/ClientForm";
import { useToast } from "@/components/ui/use-toast";
import ClientInvoiceFilters from "@/components/invoices/ClientInvoiceFilters";
import { downloadInvoicesAsCSV, downloadInvoicesAsPDF } from "@/utils/invoiceExportUtils";
import { Download, FileText as FileTextIcon, FileSpreadsheet } from "lucide-react";

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [client, setClient] = useState<Client | null>(null);
  const [clientInvoices, setClientInvoices] = useState<any[]>([]);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [currentYearInvoices, setCurrentYearInvoices] = useState<any[]>([]);
  
  // NEW state for filters:
  const [selectedMonth, setSelectedMonth] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");

  // In a real app, this would be replaced with API calls
  useEffect(() => {
    if (!id) return;
    
    const foundClient = mockClients.find(client => client.id === id);
    if (foundClient) {
      setClient(foundClient);
      
      const invoices = mockInvoices.filter(invoice => invoice.clientId === id);
      setClientInvoices(invoices);
      
      // Calculate current financial year (April to March)
      const today = new Date();
      const currentYear = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
      const startDate = new Date(`${currentYear}-04-01`);
      const endDate = new Date(`${currentYear + 1}-03-31`);
      
      // Filter invoices for current financial year
      const fyInvoices = invoices.filter(invoice => {
        const invoiceDate = new Date(invoice.date);
        return invoiceDate >= startDate && invoiceDate <= endDate;
      });
      
      setCurrentYearInvoices(fyInvoices);
    }
  }, [id]);

  // Filter invoices by selected month/year
  const filteredInvoices = useMemo(() => {
    return clientInvoices.filter(invoice => {
      let match = true;
      if (selectedMonth !== "All") {
        const monthIdx = [
          "January","February","March","April","May","June","July",
          "August","September","October","November","December"
        ].indexOf(selectedMonth);
        if (monthIdx >= 0) {
          const invDate = new Date(invoice.date);
          match = match && invDate.getMonth() === monthIdx;
        }
      }
      if (selectedYear !== "All") {
        const invDate = new Date(invoice.date);
        match = match && invDate.getFullYear() === parseInt(selectedYear);
      }
      return match;
    });
  }, [clientInvoices, selectedMonth, selectedYear]);

  const resetFilters = () => {
    setSelectedMonth("All");
    setSelectedYear("All");
  };
  
  if (!client) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-xl font-semibold">Client not found</h2>
          <p className="text-muted-foreground mt-2">The client you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/clients')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Clients
          </Button>
        </div>
      </Layout>
    );
  }
  
  const handleEditClient = (updatedClient: Omit<Client, "id">) => {
    const updated = {
      ...updatedClient,
      id: client.id,
    };
    setClient(updated);
    setIsEditClientOpen(false);
    toast({
      title: "Client Updated",
      description: `${updated.companyName} has been updated successfully.`,
    });
  };
  
  const handleDeleteClient = () => {
    // In a real app, this would call an API
    toast({
      title: "Client Deleted",
      description: `${client.companyName} has been deleted.`,
    });
    navigate('/clients');
  };
  
  const handleCreateInvoice = () => {
    navigate(`/invoices/new?clientId=${client.id}`);
  };

  return (
    <Layout>
      <div className="page-header flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon" 
            className="mr-4" 
            onClick={() => navigate('/clients')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="page-title">{client.companyName}</h1>
            <p className="page-description text-sm text-muted-foreground">
              Client profile and details
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsEditClientOpen(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDeleteClient}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
            <CardDescription>Contact details and address</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-4">
              <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Company</p>
                <p className="text-sm text-muted-foreground">{client.companyName}</p>
              </div>
            </div>
            
            {/* GST Number */}
            <div className="flex items-start space-x-4">
              <Receipt className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">GST Number</p>
                <p className="text-sm text-muted-foreground">{client.gstNumber || "Not provided"}</p>
              </div>
            </div>

            {/* FY Invoices */}
            <div className="flex items-start space-x-4">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">FY Invoices</p>
                <p className="text-sm text-muted-foreground">{currentYearInvoices.length}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Contact Person</p>
                <p className="text-sm text-muted-foreground">{client.contactName}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Email</p>
                <p className="text-sm text-muted-foreground">{client.email}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Phone</p>
                <p className="text-sm text-muted-foreground">{client.phone}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-start space-x-4">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Address</p>
                <p className="text-sm text-muted-foreground">
                  {client.address}, {client.city}, {client.state} {client.postalCode}
                </p>
              </div>
            </div>
            
            {client.website && (
              <div className="flex items-start space-x-4">
                <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Website</p>
                  <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                    {client.website}
                  </a>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleCreateInvoice} className="w-full">
              <FileText className="mr-2 h-4 w-4" /> Create New Invoice
            </Button>
          </CardFooter>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Client invoice history</CardDescription>
            {/* --- DEBUG: Start of Export Buttons Section --- */}
            <div style={{ border: "2px dashed #f59e42", padding: "4px", marginTop: "16px", marginBottom: "8px", background: "#fff8e6" }}>
              <span style={{ fontWeight: "bold", color: "#b45309" }}>
                [Export Buttons Area]
              </span>
              <div className="flex flex-wrap gap-2 mt-3" style={{ zIndex: 1000 }}>
                <Button
                  variant="outline"
                  onClick={() => downloadInvoicesAsCSV(filteredInvoices)}
                  size="sm"
                  className="gap-1"
                  title="Export to Excel"
                  style={{ background: "#dbf4ff", border: "1.5px solid #0667a6" }}
                >
                  {/* Use correct lucide icon from allowed list */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 20h16M9 16l3 3 3-3M12 4v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Excel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => downloadInvoicesAsPDF(filteredInvoices)}
                  size="sm"
                  className="gap-1"
                  title="Export to PDF"
                  style={{ background: "#fbeee6", border: "1.5px solid #c2410c" }}
                >
                  {/* Use correct lucide icon from allowed list */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 20h16M9 16l3 3 3-3M12 4v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  PDF
                </Button>
              </div>
              <span style={{ fontSize: "0.95em", color: "#7c470d" }}>
                If you see this box but not the buttons, let me know!
              </span>
            </div>
            {/* --- DEBUG: End Export Buttons Section --- */}
          </CardHeader>
          <CardContent>
            <ClientInvoiceFilters
              invoices={clientInvoices}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              resetFilters={resetFilters}
            />
            {filteredInvoices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <FileTextIcon className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No invoices found for selected filter</p>
                <Button onClick={handleCreateInvoice} variant="outline" className="mt-4">
                  Create Invoice
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInvoices.map(invoice => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <p className="font-medium">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-muted-foreground">{invoice.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{invoice.total.toLocaleString()}</p>
                      <p className={`text-sm ${
                        invoice.status === 'paid' 
                          ? 'text-green-600' 
                          : invoice.status === 'overdue' 
                            ? 'text-red-600' 
                            : 'text-amber-600'
                      }`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <ClientForm
        open={isEditClientOpen}
        onClose={() => setIsEditClientOpen(false)}
        onSubmit={handleEditClient}
        initialData={client}
      />
    </Layout>
  );
};

export default ClientDetails;
