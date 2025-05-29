
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Eye, Download, Mail, CheckCircle2, Clock, Send, AlertCircle, FileWarning } from "lucide-react";
import { Invoice, Client } from "@/types";
import { format, parseISO } from "date-fns";
import { Link } from "react-router-dom";

interface InvoiceQuickViewProps {
  invoice: Invoice | null;
  client: Client | null;
  open: boolean;
  onClose: () => void;
  onStatusUpdate: (status: Invoice['status']) => void;
}

const InvoiceQuickView = ({
  invoice,
  client,
  open,
  onClose,
  onStatusUpdate,
}: InvoiceQuickViewProps) => {
  if (!invoice || !client) return null;

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'sent':
        return <Send className="h-4 w-4 text-blue-500" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileWarning className="h-4 w-4 text-gray-500" />;
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
        className={`${statusStyles[status]} flex items-center gap-1`}
      >
        {getStatusIcon(status)}
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

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Invoice {invoice.invoiceNumber}
            {getStatusBadge(invoice.status)}
          </SheetTitle>
          <SheetDescription>
            Quick overview and actions for this invoice
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Client Information */}
          <div>
            <h3 className="font-semibold mb-3">Client Details</h3>
            <div className="space-y-2">
              <div>
                <p className="font-medium">{client.companyName}</p>
                <p className="text-sm text-muted-foreground">{client.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  GST: {client.gstNumber}
                </p>
                <p className="text-sm text-muted-foreground">
                  Phone: {client.phoneNumber}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Invoice Details */}
          <div>
            <h3 className="font-semibold mb-3">Invoice Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Date:</span>
                <span className="text-sm font-medium">
                  {format(parseISO(invoice.date), "dd MMM yyyy")}
                </span>
              </div>
              {invoice.dueDate && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Due Date:</span>
                  <span className="text-sm font-medium">
                    {format(parseISO(invoice.dueDate), "dd MMM yyyy")}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Items:</span>
                <span className="text-sm font-medium">{invoice.items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Subtotal:</span>
                <span className="text-sm font-medium">
                  {formatCurrency(invoice.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">GST:</span>
                <span className="text-sm font-medium">
                  {formatCurrency(invoice.gstAmount)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">Total:</span>
                <span className="font-semibold text-lg">
                  {formatCurrency(invoice.total)}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Quick Actions */}
          <div>
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button asChild className="w-full" variant="outline">
                <Link to={`/invoices/${invoice.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Invoice
                </Link>
              </Button>
              
              <Button className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>

              <Button className="w-full" variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Send Reminder
              </Button>

              {invoice.status !== 'paid' && (
                <Button 
                  className="w-full" 
                  onClick={() => onStatusUpdate('paid')}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark as Paid
                </Button>
              )}
            </div>
          </div>

          {invoice.notes && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground">{invoice.notes}</p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default InvoiceQuickView;
