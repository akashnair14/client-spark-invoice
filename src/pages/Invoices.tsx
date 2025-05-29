
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Download, CheckCircle2, Clock, Send, AlertCircle, FileWarning } from "lucide-react";
import { Link } from "react-router-dom";
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
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { mockInvoices, mockClients } from "@/data/mockData";
import { Invoice, Client } from "@/types";
import { format, parseISO, isAfter } from "date-fns";
import InvoiceFilters from "@/components/invoices/InvoiceFilters";
import InvoiceBulkActions from "@/components/invoices/InvoiceBulkActions";
import InvoiceQuickView from "@/components/invoices/InvoiceQuickView";
import InvoiceExport from "@/components/invoices/InvoiceExport";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const InvoicesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [statusFilter, setStatusFilter] = useState<Invoice['status'] | 'all'>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [financialYearFilter, setFinancialYearFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [quickViewInvoice, setQuickViewInvoice] = useState<Invoice | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredInvoices = invoices.filter((invoice) => {
    // Search filter
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mockClients
        .find((client) => client.id === invoice.clientId)
        ?.companyName.toLowerCase()
        .includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    // Client filter
    const matchesClient = clientFilter === 'all' || invoice.clientId === clientFilter;
    
    // Financial year filter
    const matchesFY = financialYearFilter === 'all' || (() => {
      const year = new Date(invoice.date).getFullYear();
      const fy = year >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
      return fy === financialYearFilter;
    })();
    
    // Date range filter
    const matchesDateRange = (!dateRange.from || !dateRange.to) || (
      new Date(invoice.date) >= dateRange.from && new Date(invoice.date) <= dateRange.to
    );
    
    return matchesSearch && matchesStatus && matchesClient && matchesFY && matchesDateRange;
  });

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 mr-1 text-yellow-500" />;
      case 'sent':
        return <Send className="h-4 w-4 mr-1 text-blue-500" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 mr-1 text-red-500" />;
      default:
        return <FileWarning className="h-4 w-4 mr-1 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: Invoice["status"]) => {
    const statusStyles = {
      draft: "bg-gray-100 text-gray-800 border-gray-300",
      sent: "bg-blue-100 text-blue-800 border-blue-300",
      paid: "bg-green-100 text-green-800 border-green-300",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      overdue: "bg-red-100 text-red-800 border-red-300",
    };

    return (
      <Badge
        variant="outline"
        className={`${statusStyles[status]} flex items-center`}
      >
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleDeleteInvoice = (invoice: Invoice) => {
    setInvoices(invoices.filter((inv) => inv.id !== invoice.id));
  };

  const handleUpdateStatus = (invoice: Invoice, newStatus: Invoice['status']) => {
    setInvoices(invoices.map(inv => {
      if (inv.id === invoice.id) {
        return { ...inv, status: newStatus };
      }
      return inv;
    }));
  };

  const handleBulkDelete = (invoiceIds: string[]) => {
    setInvoices(invoices.filter(inv => !invoiceIds.includes(inv.id)));
    setSelectedInvoices([]);
  };

  const handleBulkStatusUpdate = (invoiceIds: string[], status: Invoice['status']) => {
    setInvoices(invoices.map(inv => {
      if (invoiceIds.includes(inv.id)) {
        return { ...inv, status };
      }
      return inv;
    }));
    setSelectedInvoices([]);
  };

  const handleSelectInvoice = (invoiceId: string, checked: boolean) => {
    if (checked) {
      setSelectedInvoices([...selectedInvoices, invoiceId]);
    } else {
      setSelectedInvoices(selectedInvoices.filter(id => id !== invoiceId));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getInvoiceType = (invoice: Invoice) => {
    return invoice.gstType === "igst" ? "Inter-State" : "Intra-State";
  };

  const getLastStatusUpdate = (invoice: Invoice) => {
    // Mock last status update date - in real app this would come from backend
    return format(parseISO(invoice.date), "dd-MMM-yy");
  };

  return (
    <Layout>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Invoices</h1>
          <p className="page-description">Manage your invoices and track payments</p>
        </div>
        <div className="flex items-center gap-2">
          <InvoiceExport invoices={filteredInvoices} selectedInvoices={selectedInvoices} />
          <Link to="/invoices/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" /> New Invoice
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <InvoiceFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          clientFilter={clientFilter}
          onClientFilterChange={setClientFilter}
          financialYearFilter={financialYearFilter}
          onFinancialYearFilterChange={setFinancialYearFilter}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          clients={mockClients}
          invoices={invoices}
        />

        <InvoiceBulkActions
          selectedInvoices={selectedInvoices}
          onSelectionChange={setSelectedInvoices}
          invoices={paginatedInvoices}
          onBulkDelete={handleBulkDelete}
          onBulkStatusUpdate={handleBulkStatusUpdate}
        />

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedInvoices.length === paginatedInvoices.length && paginatedInvoices.length > 0}
                    indeterminate={selectedInvoices.length > 0 && selectedInvoices.length < paginatedInvoices.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedInvoices(paginatedInvoices.map(inv => inv.id));
                      } else {
                        setSelectedInvoices([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden lg:table-cell">Due Date</TableHead>
                <TableHead className="hidden lg:table-cell">Last Update</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">PDF</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="h-24 text-center">
                    No invoices found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedInvoices.map((invoice) => {
                  const client = mockClients.find(
                    (c) => c.id === invoice.clientId
                  );
                  return (
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
                      <TableCell>{client?.companyName || "Unknown"}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">
                          {getInvoiceType(invoice)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {format(parseISO(invoice.date), "dd-MMM-yy")}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {invoice.dueDate ? format(parseISO(invoice.dueDate), "dd-MMM-yy") : "N/A"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {getLastStatusUpdate(invoice)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(invoice.total)}
                      </TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setQuickViewInvoice(invoice)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Quick View
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/invoices/${invoice.id}`}>View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleUpdateStatus(invoice, 'paid')}>
                              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> 
                              Mark as Paid
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(invoice, 'pending')}>
                              <Clock className="h-4 w-4 mr-2 text-yellow-500" /> 
                              Mark as Pending
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteInvoice(invoice)}>
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Invoices per page:</span>
            <Select value={itemsPerPage.toString()} onValueChange={(value) => {
              setItemsPerPage(parseInt(value));
              setCurrentPage(1);
            }}>
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
            <span className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of{" "}
              {filteredInvoices.length} invoices
            </span>
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>

      <InvoiceQuickView
        invoice={quickViewInvoice}
        client={quickViewInvoice ? mockClients.find(c => c.id === quickViewInvoice.clientId) || null : null}
        open={!!quickViewInvoice}
        onClose={() => setQuickViewInvoice(null)}
        onStatusUpdate={(status) => {
          if (quickViewInvoice) {
            handleUpdateStatus(quickViewInvoice, status);
            setQuickViewInvoice({ ...quickViewInvoice, status });
          }
        }}
      />
    </Layout>
  );
};

export default InvoicesPage;
