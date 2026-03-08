
import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DownloadPdfButtonProps {
  printableRef: React.RefObject<HTMLDivElement>;
  invoiceNumber: string;
}

const DownloadPdfButton = ({ printableRef, invoiceNumber }: DownloadPdfButtonProps) => {
  const { toast } = useToast();

  const handleDownloadPDF = () => {
    if (!printableRef.current) {
      toast({
        title: "Error",
        description: "Invoice content not ready. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Generating PDF",
      description: "Please wait while we generate your invoice PDF...",
    });

    // Get the invoice content
    const invoiceContent = printableRef.current.innerHTML;
    
    // Create a new window for printing/PDF generation
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice ${invoiceNumber}</title>
          <style>
            @page {
              size: A4;
              margin: 10mm;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
              html, body {
                width: 210mm;
                height: 297mm;
              }
            }
            body { 
              font-family: Arial, sans-serif; 
              margin: 0;
              padding: 10mm;
              background: white !important;
              color: black !important;
              width: 210mm;
              max-height: 277mm;
              overflow: hidden;
              box-sizing: border-box;
            }
            * {
              background: white !important;
              color: black !important;
            }
            .bg-primary { color: #3b82f6 !important; }
            .text-primary { color: #3b82f6 !important; }
            .border { border: 1px solid #e5e7eb !important; }
            .border-border { border-color: #e5e7eb !important; }
            .bg-primary-foreground { background: #f8fafc !important; }
          </style>
        </head>
        <body>
          ${invoiceContent}
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load, then trigger print
      setTimeout(() => {
        printWindow.print();
        
        // Close window after print dialog
        setTimeout(() => {
          printWindow.close();
          toast({
            title: "PDF Generated",
            description: `Invoice ${invoiceNumber} has been sent to your printer/PDF viewer.`,
          });
        }, 1000);
      }, 500);
    } else {
      toast({
        title: "Error",
        description: "Unable to open print window. Please check your browser settings.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
      <Download className="h-4 w-4 mr-2" />
      Download PDF
    </Button>
  );
};

export default DownloadPdfButton;
