
import React from "react";

interface InvoiceHeaderProps {
  invoiceNumber: string;
  isPDF?: boolean;
}

const InvoiceHeader = ({ invoiceNumber, isPDF = false }: InvoiceHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between mb-10">
      <div>
        <h1 
          className="text-3xl font-bold text-primary mb-1"
          style={isPDF ? {color: '#3b82f6'} : undefined}
        >
          INVOICE
        </h1>
        <p className={isPDF ? "text-sm text-gray-600" : "text-sm text-muted-foreground"}>
          #{invoiceNumber}
        </p>
      </div>
      <div className="mt-4 md:mt-0 text-right">
        <div className="font-bold text-lg">Your Company Name</div>
        <div className={isPDF ? "text-sm text-gray-600 mt-1" : "text-sm text-muted-foreground mt-1"}>
          <p>123 Your Street Address</p>
          <p>City, State, PIN Code</p>
          <p>GSTIN: 27AAPFU0939F1ZV</p>
          <p>Email: your.email@example.com</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;
