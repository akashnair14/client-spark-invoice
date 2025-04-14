
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, CheckCircle2, Clock, Send, AlertCircle, FileWarning } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { mockInvoices, mockClients } from "@/data/mockData";
import { Invoice } from "@/types";
import { format, parseISO } from "date-fns";

const InvoicesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [statusFilter, setStatusFilter] = useState<Invoice['status'] | 'all'>('all');

  const filteredInvoices = invoices.filter(
    (invoice) => {
      // Apply search filter
      const matchesSearch = 
        invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mockClients
          .find((client) => client.id === invoice.clientId)
          ?.companyName.toLowerCase()
          .includes(searchQuery.toLowerCase());
      
      // Apply status filter
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    }
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
      draft: "bg-gray-100 text-gray-800",
      sent: "bg-blue-100 text-blue-800",
      paid: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      overdue: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
      >
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
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

  return (
    <Layout>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Invoices</h1>
          <p className="page-description">Manage your invoices</p>
        </div>
        <Link to="/invoices/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> New Invoice
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="md:ml-2 w-full md:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                {statusFilter === 'all' ? "All Statuses" : (
                  <>
                    {getStatusIcon(statusFilter)}
                    {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter('paid')}>
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> Paid
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                <Clock className="h-4 w-4 mr-2 text-yellow-500" /> Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('sent')}>
                <Send className="h-4 w-4 mr-2 text-blue-500" /> Sent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('overdue')}>
                <AlertCircle className="h-4 w-4 mr-2 text-red-500" /> Overdue
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('draft')}>
                <FileWarning className="h-4 w-4 mr-2 text-gray-500" /> Draft
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden lg:table-cell">Due Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No invoices found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => {
                  const client = mockClients.find(
                    (c) => c.id === invoice.clientId
                  );
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.invoiceNumber}
                      </TableCell>
                      <TableCell>{client?.companyName || "Unknown"}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {format(parseISO(invoice.date), "dd-MMM-yy")}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {format(parseISO(invoice.dueDate), "dd-MMM-yy")}
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{invoice.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/invoices/${invoice.id}`}>View</Link>
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
      </div>
    </Layout>
  );
};

export default InvoicesPage;
