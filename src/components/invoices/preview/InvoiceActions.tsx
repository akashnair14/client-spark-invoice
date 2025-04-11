
import React from "react";
import { Download, Printer, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { format } from "date-fns";

interface InvoiceActionsProps {
  invoiceRef: React.RefObject<HTMLDivElement>;
  printableRef: React.RefObject<HTMLDivElement>;
  invoiceNumber: string;
  clientName: string;
  clientPhoneNumber: string | undefined;
  total: number;
  dueDate: Date;
}

const InvoiceActions = ({
  invoiceRef,
  printableRef,
  invoiceNumber,
  clientName,
  clientPhoneNumber,
  total,
  dueDate,
}: InvoiceActionsProps) => {
  const { toast } = useToast();

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
        backgroundColor: "#ffffff",
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
      
      pdf.save(`Invoice-${invoiceNumber}.pdf`);
      
      toast({
        title: "PDF Downloaded",
        description: `Invoice ${invoiceNumber} has been successfully downloaded.`,
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
      const message = `Invoice ${invoiceNumber} from Your Company Name to ${clientName}.\nAmount: ₹${total.toFixed(2)}\nDue Date: ${format(dueDate, "dd/MM/yyyy")}`;
      
      // Encode the message for the URL
      const encodedMessage = encodeURIComponent(message);
      
      // Generate WhatsApp link
      const whatsappUrl = `https://wa.me/${clientPhoneNumber?.replace(/\D/g, '')}?text=${encodedMessage}`;
      
      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "WhatsApp Opened",
        description: `Sharing invoice ${invoiceNumber} with ${clientName} via WhatsApp.`,
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
  );
};

export default InvoiceActions;
