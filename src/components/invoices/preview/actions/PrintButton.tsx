
import React from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrintButtonProps {
  onClick: () => void;
}

const PrintButton = ({ onClick }: PrintButtonProps) => {
  return (
    <Button variant="outline" size="sm" onClick={onClick}>
      <Printer className="h-4 w-4 mr-2" />
      Print
    </Button>
  );
};

export default PrintButton;
