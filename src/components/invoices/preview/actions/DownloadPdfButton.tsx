
import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface DownloadPdfButtonProps {
  printableRef: React.RefObject<HTMLDivElement>;
  invoiceNumber: string;
}

const DownloadPdfButton = ({ printableRef, invoiceNumber }: DownloadPdfButtonProps) => {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    if (!printableRef.current) {
      toast({
        title: "Error",
        description: "Invoice content not ready. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    toast({
      title: "Generating PDF",
      description: "Please wait while we generate your invoice PDF…",
    });

    try {
      // Temporarily make the hidden printable div visible for capture
      const el = printableRef.current;
      const parent = el.parentElement;
      const wasHidden = parent?.classList.contains("hidden");
      if (wasHidden) {
        parent!.style.position = "absolute";
        parent!.style.left = "-9999px";
        parent!.style.top = "0";
        parent!.classList.remove("hidden");
      }

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      // Restore hidden state
      if (wasHidden && parent) {
        parent.classList.add("hidden");
        parent.style.position = "";
        parent.style.left = "";
        parent.style.top = "";
      }

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Scale image to fit A4
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      const finalHeight = Math.min(imgHeight, pdfHeight);

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, finalHeight);
      pdf.save(`Invoice-${invoiceNumber}.pdf`);

      toast({
        title: "PDF Downloaded",
        description: `Invoice ${invoiceNumber} saved successfully.`,
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "PDF Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleDownloadPDF} disabled={generating}>
      {generating ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Download className="h-4 w-4 mr-2" />
      )}
      {generating ? "Generating…" : "Download PDF"}
    </Button>
  );
};

export default DownloadPdfButton;
