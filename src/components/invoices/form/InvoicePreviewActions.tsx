
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileCheck } from "lucide-react";

interface InvoicePreviewActionsProps {
  onBackToEdit: () => void;
  onFinalizeInvoice: () => void;
  hasInvoiceData: boolean;
}

const InvoicePreviewActions = ({ 
  onBackToEdit, 
  onFinalizeInvoice, 
  hasInvoiceData 
}: InvoicePreviewActionsProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <Button variant="outline" onClick={onBackToEdit}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Edit
      </Button>
      {hasInvoiceData && (
        <Button variant="default" onClick={onFinalizeInvoice}>
          <FileCheck className="h-4 w-4 mr-2" /> Finalize Invoice
        </Button>
      )}
    </div>
  );
};

export default InvoicePreviewActions;
