
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

/**
 * Normalize a phone number for WhatsApp:
 * - Strip non-digits
 * - If it starts with 0, replace with 91 (India)
 * - If it's 10 digits (Indian mobile), prefix with 91
 */
function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "91" + cleaned.slice(1);
  } else if (cleaned.length === 10) {
    cleaned = "91" + cleaned;
  }
  return cleaned;
}

const ShareWhatsAppButton = ({
  invoiceNumber,
  clientName,
  clientPhoneNumber,
  total,
  dueDate,
}: ShareWhatsAppButtonProps) => {
  const { toast } = useToast();

  const handleShareWhatsApp = () => {
    if (!clientPhoneNumber) {
      toast({
        title: "Phone Number Missing",
        description: "Client phone number is required for WhatsApp sharing.",
        variant: "destructive",
      });
      return;
    }

    try {
      const cleanPhone = normalizePhone(clientPhoneNumber);

      const message = `🧾 *Invoice ${invoiceNumber}*

👤 *To:* ${clientName}
💰 *Amount:* ₹${total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
📅 *Due Date:* ${format(dueDate, "dd/MM/yyyy")}

Thank you for your business! 🙏`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

      // Use location.href as fallback if window.open is blocked (e.g., in iframes)
      const win = window.open(whatsappUrl, "_blank");
      if (!win) {
        window.location.href = whatsappUrl;
      }

      toast({
        title: "WhatsApp Opened",
        description: `Sharing invoice ${invoiceNumber} via WhatsApp.`,
      });
    } catch (error) {
      toast({
        title: "Sharing Failed",
        description:
          "There was a problem opening WhatsApp. Please check the client's phone number.",
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
