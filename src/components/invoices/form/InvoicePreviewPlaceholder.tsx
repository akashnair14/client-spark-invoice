
import React from "react";
import { FileSpreadsheet, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const InvoicePreviewPlaceholder = () => {
  return (
    <Card className="w-full shadow-sm">
      <CardContent className="flex flex-col items-center justify-center py-16 px-4">
        <FileSpreadsheet className="h-16 w-16 text-muted-foreground mb-6" />
        <h3 className="text-xl font-medium mb-2">No Preview Available</h3>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          Please complete the invoice form to generate a preview. 
          Make sure to select a client and add at least one item.
        </p>
        <Button variant="outline" size="sm" className="gap-2">
          <ChevronLeft className="h-4 w-4" /> Go to Invoice Form
        </Button>
      </CardContent>
    </Card>
  );
};

export default InvoicePreviewPlaceholder;
