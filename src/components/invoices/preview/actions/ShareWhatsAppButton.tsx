
import React from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ShareWhatsAppButtonProps {
  invoiceNumber: string;
  clientName: string;
  clientPhoneNumber: string | undefined;
  total: number;
  dueDate: Date;
}

const ShareWhatsAppButton = ({
  invoiceNumber,
  clientName,
  clientPhoneNumber,
  total,
  dueDate
}: ShareWhatsAppButtonProps) => {
  const { toast } = useToast();

  const handleShareWhatsApp = () => {
    try {
      if (!clientPhoneNumber) {
        toast({
          title: "Phone Number Missing",
          description: "Client phone number is required for WhatsApp sharing.",
          variant: "destructive",
        });
        return;
      }

      // Create a shareable link to the invoice (you can customize this URL)
      const invoiceViewUrl = `${window.location.origin}/invoices/view/${invoiceNumber}`;
      
      // Enhanced message with more details and invoice link
      const message = `🧾 *Invoice ${invoiceNumber}*
      
📋 *From:* Your Company Name
👤 *To:* ${clientName}
💰 *Amount:* ₹${total.toFixed(2)}
📅 *Due Date:* ${format(dueDate, "dd/MM/yyyy")}

📎 *View Invoice:* ${invoiceViewUrl}

Thank you for your business! 🙏`;
      
      // Encode the message for the URL
      const encodedMessage = encodeURIComponent(message);
      
      // Clean phone number (remove non-digits)
      const cleanPhone = clientPhoneNumber.replace(/\D/g, '');
      
      // Generate WhatsApp link
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
      
      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "WhatsApp Opened",
        description: `Sharing invoice ${invoiceNumber} with enhanced details via WhatsApp.`,
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
    <Button variant="default" size="sm" onClick={handleShareWhatsApp}>
      <Share2 className="h-4 w-4 mr-2" />
      Share to WhatsApp
    </Button>
  );
};

export default ShareWhatsAppButton;
