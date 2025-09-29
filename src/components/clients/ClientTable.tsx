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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, Eye, Pencil, Trash2, FileText } from "lucide-react";
import { Client } from "@/types";
import { format, parseISO } from "date-fns";

interface ClientTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  onCreateInvoice: (client: Client) => void;
  onViewDetails: (client: Client) => void;
  selectedClients: string[];
  onSelectionChange: (clientIds: string[]) => void;
}

const ClientTable = ({
  clients,
  onEdit,
  onDelete,
  onCreateInvoice,
  onViewDetails,
  selectedClients,
  onSelectionChange,
}: ClientTableProps) => {
  const handleSelectClient = (clientId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedClients, clientId]);
    } else {
      onSelectionChange(selectedClients.filter(id => id !== clientId));
    }
  };

  const getStatusBadge = (status: Client["status"]) => {
    const statusStyles = {
      active: "bg-primary/10 text-primary border-primary/20",
      inactive: "bg-muted text-muted-foreground border-border",
      pending: "bg-accent text-accent-foreground border-accent/50",
    } as const;

    return (
      <Badge
        variant="outline"
        className={statusStyles[(status || "active") as keyof typeof statusStyles]}
      >
        {status || "active"}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (clients.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox disabled />
              </TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="hidden md:table-cell">Contact</TableHead>
              <TableHead className="hidden lg:table-cell">GST Number</TableHead>
              <TableHead className="hidden xl:table-cell">Last Invoice</TableHead>
              <TableHead className="hidden xl:table-cell">Total Invoiced</TableHead>
              <TableHead className="hidden lg:table-cell">Pending</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                No clients found.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox 
                checked={selectedClients.length === clients.length}
                indeterminate={selectedClients.length > 0 && selectedClients.length < clients.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onSelectionChange(clients.map(c => c.id));
                  } else {
                    onSelectionChange([]);
                  }
                }}
              />
            </TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="hidden md:table-cell">Contact</TableHead>
            <TableHead className="hidden lg:table-cell">GST Number</TableHead>
            <TableHead className="hidden xl:table-cell">Last Invoice</TableHead>
            <TableHead className="hidden xl:table-cell">Total Invoiced</TableHead>
            <TableHead className="hidden lg:table-cell">Pending</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id} className="animate-enter hover:bg-muted/40 transition-colors">
              <TableCell>
                <Checkbox
                  checked={selectedClients.includes(client.id)}
                  onCheckedChange={(checked) => 
                    handleSelectClient(client.id, checked === true)
                  }
                />
              </TableCell>
              <TableCell>
                <div>
                  <Link
                    to={`/clients/${client.id}`}
                    className="font-medium text-primary hover:underline inline-block transition-colors"
                  >
                    {client.companyName}
                  </Link>
                  <div className="text-sm text-muted-foreground">{client.email}</div>
                  {client.tags && client.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {client.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div>
                  <div className="font-medium">{client.contactName || "N/A"}</div>
                  <div className="text-sm text-muted-foreground">{client.phoneNumber}</div>
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell">{client.gstNumber}</TableCell>
              <TableCell className="hidden xl:table-cell">
                {client.lastInvoiceDate 
                  ? format(parseISO(client.lastInvoiceDate), "dd-MMM-yy")
                  : "Never"
                }
              </TableCell>
              <TableCell className="hidden xl:table-cell">
                {formatCurrency(client.totalInvoiced || 0)}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {client.pendingInvoices || 0}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {getStatusBadge(client.status)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails(client)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(client)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onCreateInvoice(client)}>
                      <FileText className="mr-2 h-4 w-4" />
                      Create Invoice
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => onDelete(client)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientTable;
