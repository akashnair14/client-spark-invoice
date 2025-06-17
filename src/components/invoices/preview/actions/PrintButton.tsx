
import React from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PrintButtonProps {
  onClick: () => void;
}

const PrintButton = ({ onClick }: PrintButtonProps) => {
  const { toast } = useToast();

  const handlePrint = () => {
    try {
      // Add a small delay to ensure content is rendered
      setTimeout(() => {
        window.print();
        toast({
          title: "Print Dialog Opened",
          description: "Your invoice is ready to print.",
        });
      }, 300);
    } catch (error) {
      toast({
        title: "Print Error",
        description: "Unable to open print dialog. Please try again.",
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
