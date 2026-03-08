import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, MoreHorizontal, Eye, Pencil, Trash2, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Invoice, Client } from "@/types";
import { format, parseISO } from "date-fns";
import InvoiceFilters from "@/components/invoices/InvoiceFilters";
import InvoiceBulkActions from "@/components/invoices/InvoiceBulkActions";
import InvoiceQuickView from "@/components/invoices/InvoiceQuickView";
import InvoiceExport from "@/components/invoices/InvoiceExport";
import { getClients } from "@/api/clients";
import { getInvoices as fetchInvoices, deleteInvoice as apiDeleteInvoice, updateInvoiceStatus as apiUpdateInvoiceStatus } from "@/api/invoices";
import { mapDbClient, mapDbInvoice } from "@/utils/transformers";
import { Skeleton } from "@/components/ui/skeleton";
import PageSEO from "@/components/seo/PageSEO";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Invoices = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  const { data: invoices = [], isLoading: invoicesLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: fetchInvoices,
    select: (data) => data.map(mapDbInvoice),
  });

  const { data: clients = {}, isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
    select: (data) => {
      const map: Record<string, Client> = {};
      data.forEach((c) => {
        const mapped = mapDbClient(c);
        map[mapped.id] = mapped;
      });
      return map;
    },
  });

  const loading = invoicesLoading || clientsLoading;

  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[] | null>(null);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewInvoice, setQuickViewInvoice] = useState<Invoice | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const displayInvoices = filteredInvoices ?? invoices;
  const totalPages = Math.ceil(displayInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = displayInvoices.slice(startIndex, endIndex);

  const getClientName = (clientId: string) => clients[clientId]?.companyName || "Unknown Client";

  const getTaxPercentage = (invoice: Invoice) => {
    if (!invoice.items || invoice.items.length === 0) return "0%";
    return `${invoice.items[0]?.gstRate || 0}%`;
  };

  const getStatusBadge = (status: Invoice["status"]) => {
    const statusStyles = {
      paid: "bg-success/15 text-success border-success/30",
      pending: "bg-warning/15 text-warning border-warning/30",
      overdue: "bg-destructive/15 text-destructive border-destructive/30",
      draft: "bg-muted text-muted-foreground border-border",
      sent: "bg-info/15 text-info border-info/30",
    } as const;
    return (
      <Badge variant="outline" className={statusStyles[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => apiUpdateInvoiceStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoices'] }),
    onError: (err: Error) => toast({ title: "Update Failed", description: err.message, variant: "destructive" }),
  });

  const handleStatusUpdate = async (invoiceId: string, newStatus: Invoice["status"]) => {
    statusMutation.mutate({ id: invoiceId, status: newStatus });
    toast({ title: "Status Updated", description: `Invoice marked as ${newStatus}.` });
  };

  const handleBulkStatusUpdate = async (invoiceIds: string[], status: Invoice['status']) => {
    try {
      await Promise.all(invoiceIds.map(id => apiUpdateInvoiceStatus(id, status)));
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      setSelectedInvoices([]);
    } catch (err: any) {
      toast({ title: "Update Failed", description: err.message, variant: "destructive" });
    }
  };

  const deleteMutation = useMutation({
    mutationFn: apiDeleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({ title: "Invoice Deleted", description: "Invoice has been deleted successfully." });
      setDeleteTarget(null);
    },
    onError: (err: Error) => {
      toast({ title: "Delete Failed", description: err.message, variant: "destructive" });
      setDeleteTarget(null);
    },
  });

  const confirmDeleteInvoice = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget);
  };

  const handleBulkDelete = async (invoiceIds: string[]) => {
    try {
      await Promise.all(invoiceIds.map(id => apiDeleteInvoice(id)));
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      setSelectedInvoices([]);
    } catch (err: any) {
      toast({ title: "Delete Failed", description: err.message, variant: "destructive" });
    }
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
      filtered = filtered.filter((invoice) => new Date(invoice.date) >= new Date(dateFrom));
    }
    if (dateTo) {
      filtered = filtered.filter((invoice) => new Date(invoice.date) <= new Date(dateTo));
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

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6 p-1">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-36" />
          </div>
          <Skeleton className="h-10 w-full" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageSEO
        title="Invoices | SparkInvoice"
        description="View, filter, and manage invoices."
        canonicalUrl={window.location.origin + "/invoices"}
      />
      <div className="space-y-4 md:space-y-6 animate-fade-in">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">Invoices</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage and track your invoices ({displayInvoices.length} total)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <InvoiceExport invoices={displayInvoices} selectedInvoices={selectedInvoices} />
            <Link to="/invoices/new">
              <Button className="gap-2 shadow-sm">
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

        {/* Mobile card view */}
        {isMobile ? (
          <div className="space-y-3">
            {currentInvoices.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-8 text-center text-muted-foreground">
                  {invoices.length === 0
                    ? "No invoices created yet. Tap 'Create Invoice' to get started."
                    : "No invoices found with current filters."}
                </CardContent>
              </Card>
            ) : (
              currentInvoices.map((invoice) => (
                <Card
                  key={invoice.id}
                  className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleQuickView(invoice)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold truncate">{getClientName(invoice.clientId)}</p>
                        <p className="text-xs text-muted-foreground">{invoice.invoiceNumber}</p>
                      </div>
                      {getStatusBadge(invoice.status)}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted-foreground">
                        {format(parseISO(invoice.date), "dd MMM yyyy")}
                      </span>
                      <span className="text-base font-bold text-foreground">
                        {formatCurrency(invoice.total)}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
                      <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs" asChild>
                        <Link
                          to={`/invoices/new?edit=${invoice.id}`}
                          state={{ editInvoice: invoice, editClient: clients[invoice.clientId] }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Pencil className="mr-1 h-3 w-3" /> Edit
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 h-8 text-xs text-destructive hover:text-destructive"
                        onClick={(e) => { e.stopPropagation(); setDeleteTarget(invoice.id); }}
                      >
                        <Trash2 className="mr-1 h-3 w-3" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        ) : (
          /* Desktop table view */
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={allSelected ? true : someSelected ? "indeterminate" : false}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedInvoices(currentInvoices.map(i => i.id));
                        } else {
                          setSelectedInvoices([]);
                        }
                      }}
                      aria-label="Select all invoices"
                    />
                  </TableHead>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Due Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Tax %</TableHead>
                  <TableHead className="hidden xl:table-cell">Last Update</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
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
                    <TableRow key={invoice.id} className="hover:bg-muted/40 transition-colors">
                      <TableCell>
                        <Checkbox
                          checked={selectedInvoices.includes(invoice.id)}
                          onCheckedChange={(checked) =>
                            handleSelectInvoice(invoice.id, checked === true)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{getClientName(invoice.clientId)}</TableCell>
                      <TableCell>{format(parseISO(invoice.date), "dd-MMM-yy")}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {invoice.dueDate ? format(parseISO(invoice.dueDate), "dd-MMM-yy") : "N/A"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant="outline">{getTaxPercentage(invoice)}</Badge>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        {invoice.lastStatusUpdate
                          ? format(parseISO(invoice.lastStatusUpdate), "dd-MMM-yy")
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(invoice.total)}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleQuickView(invoice)}>
                              <Eye className="mr-2 h-4 w-4" /> Quick View
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                to={`/invoices/new?edit=${invoice.id}`}
                                state={{ editInvoice: invoice, editClient: clients[invoice.clientId] }}
                              >
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {invoice.status !== "paid" && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(invoice.id, "paid")}>
                                Mark as Paid
                              </DropdownMenuItem>
                            )}
                            {invoice.status !== "pending" && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(invoice.id, "pending")}>
                                Mark as Pending
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteTarget(invoice.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
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
        )}

        {/* Pagination */}
        {displayInvoices.length > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-muted-foreground">
              Showing {startIndex + 1}–{Math.min(endIndex, displayInvoices.length)} of {displayInvoices.length}
            </span>
            <div className="flex items-center gap-3">
              {!isMobile && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Per page:</span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => { setItemsPerPage(Number(value)); setCurrentPage(1); }}
                  >
                    <SelectTrigger className="w-20 h-8">
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
              )}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Previous</span>
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentPage}/{totalPages || 1}
                </span>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= totalPages}>
                  <span className="hidden sm:inline mr-1">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <InvoiceQuickView
          open={isQuickViewOpen}
          onClose={() => { setIsQuickViewOpen(false); setQuickViewInvoice(undefined); }}
          invoice={quickViewInvoice || null}
          client={quickViewInvoice ? clients[quickViewInvoice.clientId] || null : null}
          onStatusUpdate={handleQuickViewStatusUpdate}
        />

        {/* Delete confirmation dialog */}
        <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this invoice? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteInvoice} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default Invoices;
