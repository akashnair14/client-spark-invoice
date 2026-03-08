
import React from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const PrintButton = () => {
  const { toast } = useToast();

  const handlePrint = () => {
    try {
      // Attempt window.print — works on published sites but may be blocked in iframe previews
      setTimeout(() => {
        window.print();
      }, 200);

      toast({
        title: "Print Dialog",
        description: "Opening the print dialog for your invoice.",
      });
    } catch (error) {
      toast({
        title: "Print Unavailable",
        description:
          "Printing is not supported in the preview. Please publish or use Download PDF instead.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handlePrint}>
      <Printer className="h-4 w-4 mr-2" />
      Print
    </Button>
  );
};

export default PrintButton;
