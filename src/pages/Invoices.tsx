import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, MoreHorizontal, Eye, Pencil, Trash2, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Invoice, Client } from "@/types";
import { format, parseISO } from "date-fns";
import InvoiceFilters from "@/components/invoices/InvoiceFilters";
import InvoiceBulkActions from "@/components/invoices/InvoiceBulkActions";
import InvoiceQuickView from "@/components/invoices/InvoiceQuickView";
import InvoiceExport from "@/components/invoices/InvoiceExport";
import { getClients } from "@/api/clients";
import PageSEO from "@/components/seo/PageSEO";

const Invoices = () => {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<any[]>([]);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewInvoice, setQuickViewInvoice] = useState<Invoice | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [clients, setClients] = useState<Record<string, Client>>({});

  // Load invoices from localStorage and clients from backend
  useEffect(() => {
    // Load invoices from database using the useDashboardData hook or API
    const loadInvoices = async () => {
      try {
        // Replace localStorage with real API call when invoice API is ready
        const storedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
        setInvoices(storedInvoices);
        setFilteredInvoices(storedInvoices);
      } catch (error) {
        toast({
          title: "Error loading invoices",
          description: "Failed to load invoice data",
          variant: "destructive",
        });
        setInvoices([]);
        setFilteredInvoices([]);
      }
    };

    // Load clients from backend
    const loadClients = async () => {
      try {
        const clientsData = await getClients();
        const clientsMap: Record<string, Client> = {};
        clientsData.forEach((c: any) => {
          clientsMap[c.id] = {
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
          };
        });
        setClients(clientsMap);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load clients data",
          variant: "destructive",
        });
      }
    };

    loadInvoices();
    loadClients();
  }, [toast]);

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = filteredInvoices.slice(startIndex, endIndex);

  const getClientName = (clientId: string) => {
    return clients[clientId]?.companyName || "Unknown Client";
  };

  const getTaxPercentage = (invoice: any) => {
    if (!invoice.items || invoice.items.length === 0) return "0%";
    // Get the GST rate from the first item (assuming all items have same GST rate)
    const gstRate = invoice.items[0]?.gstRate || 0;
    return `${gstRate}%`;
  };

  const getStatusBadge = (status: Invoice["status"]) => {
    const statusStyles = {
      paid: "bg-primary/10 text-primary border-primary/20",
      pending: "bg-accent text-accent-foreground border-accent/50",
      overdue: "bg-destructive/10 text-destructive border-destructive/20",
      draft: "bg-muted text-muted-foreground border-border",
      sent: "bg-secondary text-secondary-foreground border-border",
    } as const;

    return (
      <Badge
        variant="outline"
        className={statusStyles[status]}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const handleStatusUpdate = (invoiceId: string, newStatus: Invoice["status"]) => {
    const updatedInvoices = invoices.map((invoice) =>
      invoice.id === invoiceId 
        ? { ...invoice, status: newStatus, lastStatusUpdate: new Date().toISOString() }
        : invoice
    );
    setInvoices(updatedInvoices);
    setFilteredInvoices(updatedInvoices);
    
    // Update localStorage
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    
    toast({
      title: "Status Updated",
      description: `Invoice ${invoices.find(i => i.id === invoiceId)?.invoiceNumber} marked as ${newStatus}.`,
    });
  };

  const handleBulkStatusUpdate = (invoiceIds: string[], status: Invoice['status']) => {
    const updatedInvoices = invoices.map((invoice) =>
      invoiceIds.includes(invoice.id)
        ? { ...invoice, status, lastStatusUpdate: new Date().toISOString() }
        : invoice
    );
    setInvoices(updatedInvoices);
    setFilteredInvoices(updatedInvoices);
    setSelectedInvoices([]);
    
    // Update localStorage
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    const updatedInvoices = invoices.filter((invoice) => invoice.id !== invoiceId);
    setInvoices(updatedInvoices);
    setFilteredInvoices(updatedInvoices);
    setSelectedInvoices(selectedInvoices.filter(id => id !== invoiceId));
    
    // Update localStorage
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    
    toast({
      title: "Invoice Deleted",
      description: "Invoice has been deleted successfully.",
    });
  };

  const handleBulkDelete = (invoiceIds: string[]) => {
    const updatedInvoices = invoices.filter((invoice) => !invoiceIds.includes(invoice.id));
    setInvoices(updatedInvoices);
    setFilteredInvoices(updatedInvoices);
    setSelectedInvoices([]);
    
    // Update localStorage
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
  };

  const handleSelectInvoice = (invoiceId: string, checked: boolean) => {
    if (checked) {
      setSelectedInvoices([...selectedInvoices, invoiceId]);
    } else {
      setSelectedInvoices(selectedInvoices.filter(id => id !== invoiceId));
    }
  };

  const handleFilter = (
    statusFilter: string,
    dateFrom: string,
    dateTo: string,
    fyFilter: string,
    clientFilter: string
  ) => {
    let filtered = invoices;

    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((invoice) => invoice.status === statusFilter);
    }

    if (dateFrom) {
      filtered = filtered.filter((invoice) => 
        new Date(invoice.date) >= new Date(dateFrom)
      );
    }

    if (dateTo) {
      filtered = filtered.filter((invoice) => 
        new Date(invoice.date) <= new Date(dateTo)
      );
    }

    if (clientFilter && clientFilter !== "all") {
      filtered = filtered.filter((invoice) => invoice.clientId === clientFilter);
    }

    setFilteredInvoices(filtered);
    setCurrentPage(1);
  };

  const handleQuickView = (invoice: Invoice) => {
    setQuickViewInvoice(invoice);
    setIsQuickViewOpen(true);
  };

  const handleQuickViewStatusUpdate = (status: Invoice['status']) => {
    if (quickViewInvoice) {
      handleStatusUpdate(quickViewInvoice.id, status);
      setQuickViewInvoice({ ...quickViewInvoice, status });
    }
  };

  const handleDownloadPDF = (invoice: any) => {
    // Create a temporary element to render the invoice for PDF generation
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const client = clients[invoice.clientId];
      if (!client) {
        toast({
          title: "Error",
          description: "Client data not found for this invoice",
          variant: "destructive",
        });
        return;
      }

      // Generate HTML content for the invoice
      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .company-details h1 { color: #3b82f6; margin: 0; }
            .invoice-details { text-align: right; }
            .client-section { margin: 30px 0; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .items-table th { background-color: #f5f5f5; }
            .totals { margin-left: auto; width: 300px; }
            .total-row { display: flex; justify-content: space-between; padding: 5px 0; }
            .total-row.final { font-weight: bold; border-top: 1px solid #000; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-details">
              <h1>Your Company Name</h1>
              <p>123 Business Street<br>Business City, Business State 12345<br>GST: 27AAPFU0939F1ZV</p>
            </div>
            <div class="invoice-details">
              <h2>TAX INVOICE</h2>
              <p>Invoice #${invoice.invoiceNumber}</p>
              <p>Date: ${new Date(invoice.date).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div class="client-section">
            <h3>Bill To:</h3>
            <p><strong>${client.companyName}</strong><br>
            ${client.address}<br>
            ${client.city}, ${client.state} ${client.postalCode}<br>
            GST: ${client.gstNumber}<br>
            Phone: ${client.phoneNumber}</p>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>HSN Code</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map((item: any) => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.hsnCode}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.rate.toFixed(2)}</td>
                  <td>₹${item.amount.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row"><span>Subtotal:</span><span>₹${invoice.subtotal.toFixed(2)}</span></div>
            <div class="total-row"><span>GST (${getTaxPercentage(invoice)}):</span><span>₹${invoice.gstAmount.toFixed(2)}</span></div>
            ${invoice.roundoff ? `<div class="total-row"><span>Round Off:</span><span>₹${invoice.roundoff.toFixed(2)}</span></div>` : ''}
            <div class="total-row final"><span>Total:</span><span>₹${invoice.total.toFixed(2)}</span></div>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
      
      // Trigger print dialog
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };

      toast({
        title: "Download Initiated",
        description: `Invoice ${invoice.invoiceNumber} is being prepared for download.`,
      });
    }
  };

  const allSelected = currentInvoices.length > 0 && selectedInvoices.length === currentInvoices.length;
  const someSelected = selectedInvoices.length > 0 && selectedInvoices.length < currentInvoices.length;

  return (
    <Layout>
      <PageSEO
        title="Invoices | SparkInvoice"
        description="View, filter, and manage invoices."
        canonicalUrl={window.location.origin + "/invoices"}
      />
      <div className="space-y-6 animate-fade-in">
        <div className="page-header flex items-center justify-between">
          <div>
            <h1 className="page-title">Invoices</h1>
            <p className="page-description">Manage and track your invoices ({filteredInvoices.length} total)</p>
          </div>
          <div className="flex items-center gap-3">
            <InvoiceExport 
              invoices={filteredInvoices} 
              selectedInvoices={selectedInvoices}
            />
            <Link to="/invoices/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Create Invoice
              </Button>
            </Link>
          </div>
        </div>

        <InvoiceFilters
          invoices={invoices}
          clients={Object.values(clients)}
          onFilter={handleFilter}
        />

        <InvoiceBulkActions
          selectedInvoices={selectedInvoices}
          onSelectionChange={setSelectedInvoices}
          invoices={currentInvoices}
          onBulkDelete={handleBulkDelete}
          onBulkStatusUpdate={handleBulkStatusUpdate}
        />

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedInvoices(currentInvoices.map(i => i.id));
                      } else {
                        setSelectedInvoices([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden lg:table-cell">Due Date</TableHead>
                <TableHead className="hidden lg:table-cell">Tax %</TableHead>
                <TableHead className="hidden xl:table-cell">Last Update</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">
                    {invoices.length === 0 ? "No invoices created yet. Click 'Create Invoice' to get started." : "No invoices found with current filters."}
                  </TableCell>
                </TableRow>
              ) : (
                currentInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="animate-enter hover:bg-muted/40 transition-colors">
                    <TableCell>
                      <Checkbox
                        checked={selectedInvoices.includes(invoice.id)}
                        onCheckedChange={(checked) => 
                          handleSelectInvoice(invoice.id, checked === true)
                        }
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell>{getClientName(invoice.clientId)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(parseISO(invoice.date), "dd-MMM-yy")}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {invoice.dueDate ? format(parseISO(invoice.dueDate), "dd-MMM-yy") : "N/A"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge variant="outline">
                        {getTaxPercentage(invoice)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      {invoice.lastStatusUpdate 
                        ? format(parseISO(invoice.lastStatusUpdate), "dd-MMM-yy")
                        : "N/A"
                      }
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(invoice.total)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getStatusBadge(invoice.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleQuickView(invoice)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Quick View
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link 
                              to={`/invoices/new?edit=${invoice.id}`} 
                              state={{ editInvoice: invoice, editClient: clients[invoice.clientId] }}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadPDF(invoice)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {invoice.status !== "paid" && (
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate(invoice.id, "paid")}
                            >
                              Mark as Paid
                            </DropdownMenuItem>
                          )}
                          {invoice.status !== "pending" && (
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate(invoice.id, "pending")}
                            >
                              Mark as Pending
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteInvoice(invoice.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {filteredInvoices.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredInvoices.length)} of {filteredInvoices.length} invoices
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Per page:</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <InvoiceQuickView
          open={isQuickViewOpen}
          onClose={() => {
            setIsQuickViewOpen(false);
            setQuickViewInvoice(undefined);
          }}
          invoice={quickViewInvoice || null}
          client={quickViewInvoice ? clients[quickViewInvoice.clientId] || null : null}
          onStatusUpdate={handleQuickViewStatusUpdate}
        />
      </div>
    </Layout>
  );
};
export default Invoices;
