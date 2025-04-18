
import React from "react";
import { Eye } from "lucide-react";

const InvoicePreviewPlaceholder = () => {
  return (
    <div className="text-center py-10 border rounded-lg bg-muted/20">
      <Eye className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">No Preview Available</h3>
      <p className="text-muted-foreground mt-2">Please create an invoice first</p>
    </div>
  );
};

export default InvoicePreviewPlaceholder;
