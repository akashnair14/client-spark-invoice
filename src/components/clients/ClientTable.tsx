
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, FileText, Trash2, Eye } from "lucide-react";
import { Client } from "@/types";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { mockInvoices } from "@/data/mockData";
import { format } from "date-fns";
import ClientFilters from "./ClientFilters";
import BulkActions from "./BulkActions";
import ClientDetailsDrawer from "./ClientDetailsDrawer";

interface ClientTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  onCreateInvoice: (client: Client) => void;
}

const ClientTable = ({
  clients,
  onEdit,
  onDelete,
  onCreateInvoice,
}: ClientTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectedClientForView, setSelectedClientForView] = useState<Client | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [tagFilters, setTagFilters] = useState<string[]>([]);

  // Calculate current financial year
  const today = new Date();
  const currentYear = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
  const startDate = new Date(`${currentYear}-04-01`);
  const endDate = new Date(`${currentYear + 1}-03-31`);

  const getClientInvoices = (clientId: string) => {
    return mockInvoices.filter(invoice => invoice.clientId === clientId);
  };

  const getFinancialYearInvoices = (clientId: string) => {
    return mockInvoices.filter(invoice => {
      const invoiceDate = new Date(invoice.date);
      return invoice.clientId === clientId && 
             invoiceDate >= startDate && 
             invoiceDate <= endDate;
    }).length;
  };

  const getTotalInvoicedAmount = (clientId: string) => {
    const clientInvoices = getClientInvoices(clientId);
    return clientInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  };

  const getPendingInvoiceCount = (clientId: string) => {
    const clientInvoices = getClientInvoices(clientId);
    return clientInvoices.filter(invoice => 
      invoice.status === 'pending' || invoice.status === 'overdue'
    ).length;
  };

  const getLastInvoiceDate = (clientId: string) => {
    const clientInvoices = getClientInvoices(clientId);
    if (clientInvoices.length === 0) return null;
    
    const lastInvoice = clientInvoices.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
    
    return lastInvoice ? new Date(lastInvoice.date) : null;
  };

  const getStatusBadge = (status?: string) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      inactive: { color: "bg-gray-100 text-gray-800", label: "Inactive" },
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { color: "bg-blue-100 text-blue-800", label: "Active" };
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  // Filter clients based on search and filters
  const filteredClients = clients.filter(client => {
    const matchesSearch = searchTerm === "" || 
      client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.gstNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    const matchesState = stateFilter === "all" || client.state === stateFilter;
    const matchesTags = tagFilters.length === 0 || 
      (client.tags && tagFilters.some(tag => client.tags?.includes(tag)));
    
    return matchesSearch && matchesStatus && matchesState && matchesTags;
  });

  const handleBulkDelete = (clientIds: string[]) => {
    clientIds.forEach(clientId => {
      const client = clients.find(c => c.id === clientId);
      if (client) onDelete(client);
    });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setStateFilter("all");
    setTagFilters([]);
  };

  const columns: ColumnDef<Client>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            if (value) {
              setSelectedClients(table.getRowModel().rows.map(row => row.original.id));
            } else {
              setSelectedClients([]);
            }
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedClients.includes(row.original.id)}
          onCheckedChange={(value) => {
            if (value) {
              setSelectedClients([...selectedClients, row.original.id]);
            } else {
              setSelectedClients(selectedClients.filter(id => id !== row.original.id));
            }
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "companyName",
      header: "Company",
      cell: ({ row }) => (
        <div className="space-y-1">
          <Link 
            to={`/clients/${row.original.id}`} 
            className="font-medium hover:underline block"
          >
            {row.getValue("companyName")}
          </Link>
          <div className="flex flex-wrap gap-1">
            {row.original.tags?.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {row.original.tags && row.original.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{row.original.tags.length - 2}
              </Badge>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "gstNumber",
      header: "GST Number",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-mono text-sm">{row.original.gstNumber}</div>
          {row.original.state && (
            <div className="text-xs text-muted-foreground">{row.original.state}</div>
          )}
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      id: "lastInvoiceDate",
      header: "Last Invoice",
      cell: ({ row }) => {
        const lastDate = getLastInvoiceDate(row.original.id);
        return (
          <div className="text-sm">
            {lastDate ? format(lastDate, 'MMM dd, yyyy') : 'No invoices'}
          </div>
        );
      },
    },
    {
      id: "totalAmount",
      header: "Total Invoiced",
      cell: ({ row }) => {
        const amount = getTotalInvoicedAmount(row.original.id);
        return (
          <div className="font-medium">
            ₹{amount.toLocaleString()}
          </div>
        );
      },
    },
    {
      id: "pendingCount",
      header: "Pending",
      cell: ({ row }) => {
        const count = getPendingInvoiceCount(row.original.id);
        return (
          <div className="text-center">
            {count > 0 ? (
              <Badge variant="outline" className="bg-orange-50 text-orange-700">
                {count}
              </Badge>
            ) : (
              <span className="text-muted-foreground">0</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "fyInvoices",
      header: "FY Invoices",
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {getFinancialYearInvoices(row.original.id)}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const client = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem 
                onClick={() => setSelectedClientForView(client)}
                className="flex items-center cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onEdit(client)}
                className="flex items-center cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Client
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onCreateInvoice(client)}
                className="flex items-center cursor-pointer"
              >
                <FileText className="mr-2 h-4 w-4" />
                Create Invoice
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setClientToDelete(client)}
                className="flex items-center text-destructive cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredClients,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="space-y-4">
      <ClientFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        stateFilter={stateFilter}
        onStateFilterChange={setStateFilter}
        tagFilters={tagFilters}
        onTagFiltersChange={setTagFilters}
        onClearFilters={handleClearFilters}
      />

      <BulkActions
        selectedClients={selectedClients}
        onSelectionChange={setSelectedClients}
        clients={filteredClients}
        onBulkDelete={handleBulkDelete}
      />

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No clients found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {filteredClients.length} client(s)
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <AlertDialog open={!!clientToDelete} onOpenChange={(isOpen) => !isOpen && setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the client 
              {clientToDelete?.companyName ? ` "${clientToDelete.companyName}"` : ''} 
              and all associated records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (clientToDelete) {
                  onDelete(clientToDelete);
                  setClientToDelete(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ClientDetailsDrawer
        client={selectedClientForView}
        open={!!selectedClientForView}
        onClose={() => setSelectedClientForView(null)}
      />
    </div>
  );
};

export default ClientTable;
