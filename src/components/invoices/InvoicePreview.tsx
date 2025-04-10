
import React, { useRef } from "react";
import { Client, Invoice, InvoiceItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Download, Printer, Share2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

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
  const invoiceRef = useRef<HTMLDivElement>(null);
  const printableRef = useRef<HTMLDivElement>(null);

  if (!client) {
    return <div className="text-center py-8">Please select a client to preview invoice</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!printableRef.current) return;
    
    toast({
      title: "Generating PDF",
      description: "Please wait while we generate your invoice PDF...",
    });

    try {
      // Add a temporary class for better PDF generation
      printableRef.current.classList.add("pdf-generation");
      
      const canvas = await html2canvas(printableRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
      });
      
      // Remove temporary class
      printableRef.current.classList.remove("pdf-generation");
      
      const imgData = canvas.toDataURL("image/png");
      
      // Calculate PDF dimensions based on canvas
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      
      // If the content is longer than one page, add new pages
      if (imgHeight > pageHeight) {
        let heightLeft = imgHeight - pageHeight;
        let position = -pageHeight;
        
        while (heightLeft > 0) {
          position -= pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }
      
      pdf.save(`Invoice-${invoice.invoiceNumber}.pdf`);
      
      toast({
        title: "PDF Downloaded",
        description: `Invoice ${invoice.invoiceNumber} has been successfully downloaded.`,
        variant: "default",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "PDF Generation Failed",
        description: "There was a problem generating your PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShareWhatsApp = () => {
    try {
      // Format the message for WhatsApp
      const message = `Invoice ${invoice.invoiceNumber} from Your Company Name to ${client.companyName}.\nAmount: ₹${total.toFixed(2)}\nDue Date: ${format(invoice.dueDate, "dd/MM/yyyy")}`;
      
      // Encode the message for the URL
      const encodedMessage = encodeURIComponent(message);
      
      // Generate WhatsApp link
      const whatsappUrl = `https://wa.me/${client.phoneNumber?.replace(/\D/g, '')}?text=${encodedMessage}`;
      
      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "WhatsApp Opened",
        description: `Sharing invoice ${invoice.invoiceNumber} with ${client.companyName} via WhatsApp.`,
      });
    } catch (error) {
      console.error("WhatsApp sharing error:", error);
      toast({
        title: "Sharing Failed",
        description: "There was a problem opening WhatsApp. Please check the client's phone number.",
        variant: "destructive",
      });
    }
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
        <CardContent className="p-6 md:p-8" ref={invoiceRef}>
          {/* This is what the user sees in the UI - with status */}
          <div className="invoice-content">
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
                <div className="grid grid-cols-2 gap-x-2 md:text-right mt-4 print:hidden">
                  <span className="text-sm font-semibold text-muted-foreground">Status:</span>
                  <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
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
          </div>
        </CardContent>
      </Card>

      {/* Hidden printable version without status - only used for PDF generation */}
      <div className="hidden">
        <div ref={printableRef} className="p-6 md:p-8 bg-white">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold text-[#9b87f5] mb-1">INVOICE</h1>
              <p className="text-sm text-gray-600">
                #{invoice.invoiceNumber}
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <div className="font-bold text-lg">Your Company Name</div>
              <div className="text-sm text-gray-600 mt-1">
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
              <h3 className="text-sm font-medium mb-2 text-gray-600">Bill To:</h3>
              <div className="border-l-2 border-[#9b87f5] pl-3">
                <h4 className="font-bold">{client.companyName}</h4>
                <p className="text-sm mt-1">{client.address}</p>
                <p className="text-sm mt-2">GSTIN: {client.gstNumber}</p>
                <p className="text-sm">{client.email}</p>
                <p className="text-sm">{client.phoneNumber}</p>
              </div>
            </div>
            <div className="flex flex-col justify-start gap-3 md:items-end">
              <div className="grid grid-cols-2 gap-x-2 md:text-right">
                <span className="text-sm text-gray-600">Issue Date:</span>
                <span className="font-medium">{format(invoice.date, "dd/MM/yyyy")}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 md:text-right">
                <span className="text-sm text-gray-600">Due Date:</span>
                <span className="font-medium">{format(invoice.dueDate, "dd/MM/yyyy")}</span>
              </div>
              {/* No status shown in the PDF */}
            </div>
          </div>

          {/* Invoice Table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
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
                  <tr key={item.id} className="border-b border-gray-200">
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
              <div className="grid grid-cols-2 gap-2 border-t border-gray-200 pt-4">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-right">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 py-2">
                <span className="text-gray-600">GST:</span>
                <span className="text-right">₹{gstAmount.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 border-t border-gray-200 pt-4 font-bold">
                <span>Total:</span>
                <span className="text-right">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium mb-2">Notes:</h4>
              <p className="text-sm text-gray-600">{invoice.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-gray-200 mt-8 pt-4 text-center text-sm text-gray-600">
            <p>Thank you for your business!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
