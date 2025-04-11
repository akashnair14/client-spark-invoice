
import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface DownloadPdfButtonProps {
  printableRef: React.RefObject<HTMLDivElement>;
  invoiceNumber: string;
}

const DownloadPdfButton = ({ printableRef, invoiceNumber }: DownloadPdfButtonProps) => {
  const { toast } = useToast();

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

  return (
    <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
      <Download className="h-4 w-4 mr-2" />
      Download PDF
    </Button>
  );
};

export default DownloadPdfButton;
