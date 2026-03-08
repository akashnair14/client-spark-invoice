
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

    const invoiceContent = printableRef.current.innerHTML;
    
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
              margin: 0;
            }
            @media print {
              html, body {
                width: 210mm;
                height: 297mm;
                margin: 0;
                padding: 0;
              }
              body { overflow: hidden; }
              .no-print { display: none; }
            }
            body { 
              font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
              margin: 0;
              padding: 0;
              background: white;
              color: #1a1a1a;
              width: 210mm;
              height: 297mm;
              overflow: hidden;
              box-sizing: border-box;
            }
          </style>
        </head>
        <body>
          ${invoiceContent}
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
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
