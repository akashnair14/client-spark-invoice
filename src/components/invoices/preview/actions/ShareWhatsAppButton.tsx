
import React from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
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
    <Button variant="default" size="sm" onClick={handleShareWhatsApp}>
      <Share2 className="h-4 w-4 mr-2" />
      Share to WhatsApp
    </Button>
  );
};

export default ShareWhatsAppButton;
