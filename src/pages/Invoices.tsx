
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
    // Load invoices from localStorage
    const loadInvoices = () => {
      try {
        const storedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
        setInvoices(storedInvoices);
        setFilteredInvoices(storedInvoices);
      } catch (error) {
        console.error('Error loading invoices from localStorage:', error);
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
        console.error('Error loading clients:', error);
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

  const getStatusBadge = (status: Invoice["status"]) => {
    const statusStyles = {
      paid: "bg-green-100 text-green-800 border-green-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      overdue: "bg-red-100 text-red-800 border-red-200",
      draft: "bg-gray-100 text-gray-800 border-gray-200",
      sent: "bg-blue-100 text-blue-800 border-blue-200",
    };

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

  const allSelected = currentInvoices.length > 0 && selectedInvoices.length === currentInvoices.length;
  const someSelected = selectedInvoices.length > 0 && selectedInvoices.length < currentInvoices.length;

  return (
    <Layout>
      <div className="space-y-6">
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
                <TableHead className="hidden lg:table-cell">Type</TableHead>
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
                  <TableRow key={invoice.id}>
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
                        {invoice.gstType === "igst" ? "IGST" : "CGST/SGST"}
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
                            <Link to={`/invoices/${invoice.id}`}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
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
