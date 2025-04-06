
import { Client, Invoice, InvoiceItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Download, Printer, Share2, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface InvoicePreviewProps {
  invoice: {
    date: Date;
    dueDate: Date;
    invoiceNumber: string;
    items: InvoiceItem[];
    notes?: string;
  };
  client: Client | undefined;
  subtotal: number;
  gstAmount: number;
  total: number;
}

const InvoicePreview = ({ invoice, client, subtotal, gstAmount, total }: InvoicePreviewProps) => {
  const { toast } = useToast();

  if (!client) {
    return <div className="text-center py-8">Please select a client to preview invoice</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    toast({
      title: "PDF Download",
      description: "Your invoice PDF is being generated and will download shortly.",
    });
  };

  const handleShareWhatsApp = () => {
    toast({
      title: "Share to WhatsApp",
      description: `Invoice ${invoice.invoiceNumber} would be shared with ${client.companyName} via WhatsApp.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 justify-end print:hidden">
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        <Button variant="default" size="sm" onClick={handleShareWhatsApp}>
          <Share2 className="h-4 w-4 mr-2" />
          Share to WhatsApp
        </Button>
      </div>

      <Card className="border border-gray-200 print:border-0 print:shadow-none animate-fade-in">
        <CardContent className="p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-1">INVOICE</h1>
              <p className="text-sm text-muted-foreground">
                #{invoice.invoiceNumber}
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <div className="font-bold text-lg">Your Company Name</div>
              <div className="text-sm text-muted-foreground mt-1">
                <p>123 Your Street Address</p>
                <p>City, State, PIN Code</p>
                <p>GSTIN: 27AAPFU0939F1ZV</p>
                <p>Email: your.email@example.com</p>
              </div>
            </div>
          </div>

          {/* Client and Invoice Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-medium mb-2 text-muted-foreground">Bill To:</h3>
              <div className="border-l-2 border-primary pl-3">
                <h4 className="font-bold">{client.companyName}</h4>
                <p className="text-sm mt-1">{client.address}</p>
                <p className="text-sm mt-2">GSTIN: {client.gstNumber}</p>
                <p className="text-sm">{client.email}</p>
                <p className="text-sm">{client.phoneNumber}</p>
              </div>
            </div>
            <div className="flex flex-col justify-start gap-3 md:items-end">
              <div className="grid grid-cols-2 gap-x-2 md:text-right">
                <span className="text-sm text-muted-foreground">Issue Date:</span>
                <span className="font-medium">{format(invoice.date, "dd/MM/yyyy")}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 md:text-right">
                <span className="text-sm text-muted-foreground">Due Date:</span>
                <span className="font-medium">{format(invoice.dueDate, "dd/MM/yyyy")}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 md:text-right mt-4">
                <span className="text-sm font-semibold text-muted-foreground">Status:</span>
                <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                  <Check className="h-3 w-3 mr-1" />
                  Generated
                </span>
              </div>
            </div>
          </div>

          {/* Invoice Table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="py-3 px-4 text-left font-medium">#</th>
                  <th className="py-3 px-4 text-left font-medium">Description</th>
                  <th className="py-3 px-4 text-left font-medium">HSN</th>
                  <th className="py-3 px-4 text-right font-medium">Qty</th>
                  <th className="py-3 px-4 text-right font-medium">Rate</th>
                  <th className="py-3 px-4 text-right font-medium">GST%</th>
                  <th className="py-3 px-4 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={item.id} className="border-b border-border">
                    <td className="py-3 px-4 text-sm">{index + 1}</td>
                    <td className="py-3 px-4 text-sm">{item.description}</td>
                    <td className="py-3 px-4 text-sm">{item.hsnCode}</td>
                    <td className="py-3 px-4 text-sm text-right">{item.quantity}</td>
                    <td className="py-3 px-4 text-sm text-right">₹{item.rate.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm text-right">{item.gstRate}%</td>
                    <td className="py-3 px-4 text-sm text-right">₹{item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-full max-w-xs">
              <div className="grid grid-cols-2 gap-2 border-t border-border pt-4">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="text-right">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 py-2">
                <span className="text-muted-foreground">GST:</span>
                <span className="text-right">₹{gstAmount.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 border-t border-border pt-4 font-bold">
                <span>Total:</span>
                <span className="text-right">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-medium mb-2">Notes:</h4>
              <p className="text-sm text-muted-foreground">{invoice.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-border mt-8 pt-4 text-center text-sm text-muted-foreground">
            <p>Thank you for your business!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoicePreview;
