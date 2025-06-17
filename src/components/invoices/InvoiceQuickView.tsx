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
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleDownloadPDF = () => {
    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const getTaxPercentage = () => {
        if (!invoice.items || invoice.items.length === 0) return "0%";
        const gstRate = invoice.items[0]?.gstRate || 0;
        return `${gstRate}%`;
      };

      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; }
            .company-details h1 { color: #3b82f6; margin: 0; font-size: 28px; }
            .company-details p { margin: 5px 0; color: #6b7280; }
            .invoice-details { text-align: right; }
            .invoice-details h2 { color: #3b82f6; margin: 0; font-size: 24px; }
            .client-section { margin: 30px 0; padding: 20px; background-color: #f9fafb; border: 1px solid #e5e7eb; }
            .client-section h3 { margin-top: 0; color: #374151; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table th, .items-table td { border: 1px solid #d1d5db; padding: 12px; text-align: left; }
            .items-table th { background-color: #f3f4f6; font-weight: 600; }
            .totals { margin: 20px 0; margin-left: auto; width: 350px; border: 1px solid #e5e7eb; padding: 20px; }
            .total-row { display: flex; justify-content: space-between; padding: 8px 0; }
            .total-row.final { font-weight: bold; border-top: 2px solid #374151; margin-top: 10px; padding-top: 10px; font-size: 18px; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-details">
              <h1>Your Company Name</h1>
              <p>123 Business Street</p>
              <p>Business City, Business State 12345</p>
              <p><strong>GST: 27AAPFU0939F1ZV</strong></p>
            </div>
            <div class="invoice-details">
              <h2>TAX INVOICE</h2>
              <p><strong>Invoice #${invoice.invoiceNumber}</strong></p>
              <p>Date: ${new Date(invoice.date).toLocaleDateString()}</p>
              ${invoice.dueDate ? `<p>Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}</p>` : ''}
            </div>
          </div>
          
          <div class="client-section">
            <h3>Bill To:</h3>
            <p><strong>${client.companyName}</strong></p>
            <p>${client.address}</p>
            <p>${client.city}, ${client.state} ${client.postalCode}</p>
            <p><strong>GST: ${client.gstNumber}</strong></p>
            <p>Phone: ${client.phoneNumber}</p>
            <p>Email: ${client.email}</p>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>HSN Code</th>
                <th>Qty</th>
                <th>Rate (₹)</th>
                <th>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map((item: any) => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.hsnCode}</td>
                  <td>${item.quantity}</td>
                  <td>${item.rate.toFixed(2)}</td>
                  <td>${item.amount.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row"><span>Subtotal:</span><span>₹${invoice.subtotal.toFixed(2)}</span></div>
            <div class="total-row"><span>GST (${getTaxPercentage()}):</span><span>₹${invoice.gstAmount.toFixed(2)}</span></div>
            ${invoice.roundoff ? `<div class="total-row"><span>Round Off:</span><span>₹${invoice.roundoff.toFixed(2)}</span></div>` : ''}
            <div class="total-row final"><span>Total Amount:</span><span>₹${invoice.total.toFixed(2)}</span></div>
          </div>

          ${invoice.notes ? `
            <div style="margin: 30px 0; padding: 15px; background-color: #f9fafb; border-left: 4px solid #3b82f6;">
              <h4 style="margin-top: 0; color: #374151;">Notes:</h4>
              <p style="margin-bottom: 0; color: #6b7280;">${invoice.notes}</p>
            </div>
          ` : ''}

          <div class="footer">
            <p>This is a computer generated invoice and does not require physical signature.</p>
            <p><strong>Thank you for your business!</strong></p>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
      
      // Trigger print dialog after content loads
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };

      toast({
        title: "PDF Download Initiated",
        description: `Invoice ${invoice.invoiceNumber} is being prepared for download.`,
      });
    }
  };

  const handleViewFullInvoice = () => {
    // Navigate to the edit page with invoice data
    navigate(`/invoices/new?edit=${invoice.id}`, {
      state: { 
        editInvoice: invoice, 
        editClient: client,
        viewMode: true 
      }
    });
    onClose();
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
              <Button 
                className="w-full" 
                variant="outline"
                onClick={handleViewFullInvoice}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Full Invoice
              </Button>
              
              <Button 
                className="w-full" 
                variant="outline"
                onClick={handleDownloadPDF}
              >
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
