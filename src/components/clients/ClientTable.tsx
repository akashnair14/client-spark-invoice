
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
import { Input } from "@/components/ui/input";
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
  const [searchType, setSearchType] = useState<"companyName" | "gstNumber">("companyName");

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "companyName",
      header: "Company",
      cell: ({ row }) => (
        <Link to={`/clients/${row.original.id}`} className="font-medium hover:underline">
          {row.getValue("companyName")}
        </Link>
      ),
    },
    {
      accessorKey: "contactName",
      header: "Contact",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "gstNumber",
      header: "GST Number",
      cell: ({ row }) => row.original.gstNumber || "N/A",
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
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem 
                onClick={() => window.location.href = `/clients/${client.id}`}
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
    data: clients,
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
    <div>
      <div className="flex items-center gap-4 py-4">
        <div className="flex items-center gap-2 flex-1">
          <select 
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as "companyName" | "gstNumber")}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="companyName">Company Name</option>
            <option value="gstNumber">GST Number</option>
          </select>
          <Input
            placeholder={searchType === "companyName" ? "Search by company name..." : "Search by GST number..."}
            value={(table.getColumn(searchType)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(searchType)?.setFilterValue(event.target.value)
            }
            className="max-w-sm flex-1"
          />
        </div>
      </div>
      <div className="rounded-md border">
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
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
    </div>
  );
};

export default ClientTable;
