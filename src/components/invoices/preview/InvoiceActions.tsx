
import React from "react";
import PrintButton from "./actions/PrintButton";
import DownloadPdfButton from "./actions/DownloadPdfButton";
import ShareWhatsAppButton from "./actions/ShareWhatsAppButton";

interface InvoiceActionsProps {
  invoiceRef: React.RefObject<HTMLDivElement>;
  printableRef: React.RefObject<HTMLDivElement>;
  invoiceNumber: string;
  clientName: string;
  clientPhoneNumber: string | undefined;
  total: number;
  dueDate: Date;
}

const InvoiceActions = ({
  printableRef,
  invoiceNumber,
  clientName,
  clientPhoneNumber,
  total,
  dueDate,
}: InvoiceActionsProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-end print:hidden">
      <PrintButton />
      
      <DownloadPdfButton 
        printableRef={printableRef} 
        invoiceNumber={invoiceNumber} 
      />
      
      <ShareWhatsAppButton
        invoiceNumber={invoiceNumber}
        clientName={clientName}
        clientPhoneNumber={clientPhoneNumber}
        total={total}
        dueDate={dueDate}
      />
    </div>
  );
};

export default InvoiceActions;
