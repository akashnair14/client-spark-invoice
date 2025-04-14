
import React from "react";

interface InvoiceHeaderProps {
  invoiceNumber: string;
  isPDF?: boolean;
  companyDetails?: {
    name: string;
    address: string[];
    gstNumber: string;
    contact: string;
  };
}

const InvoiceHeader = ({ 
  invoiceNumber, 
  isPDF = false,
  companyDetails = {
    name: "Your Company Name",
    address: ["123 Your Street Address", "City, State, PIN Code"],
    gstNumber: "27AAPFU0939F1ZV",
    contact: "your.email@example.com"
  }
}: InvoiceHeaderProps) => {
  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row justify-between mb-10">
      <div className="flex flex-col">
        <h1 
          className="text-3xl font-bold text-primary mb-1"
          style={isPDF ? {color: '#3b82f6'} : undefined}
        >
          TAX INVOICE
        </h1>
        <p className={isPDF ? "text-sm text-gray-600" : "text-sm text-muted-foreground"}>
          #{invoiceNumber}
        </p>
        <div className="mt-2">
          <p className="text-sm font-medium">Original For Receipt</p>
        </div>
      </div>
      
      <div className="text-right">
        <div className="font-bold text-xl text-primary" style={isPDF ? {color: '#3b82f6'} : undefined}>
          {companyDetails.name}
        </div>
        <div className="mt-1 text-sm bg-primary-foreground p-2 rounded border border-muted inline-block">
          <p className="font-medium">GSTIN: {companyDetails.gstNumber}</p>
          {companyDetails.address.map((line, index) => (
            <p key={index} className={isPDF ? "text-sm text-gray-600" : "text-sm text-muted-foreground"}>
              {line}
            </p>
          ))}
          <p className={isPDF ? "text-sm text-gray-600" : "text-sm text-muted-foreground"}>
            {companyDetails.contact}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;
