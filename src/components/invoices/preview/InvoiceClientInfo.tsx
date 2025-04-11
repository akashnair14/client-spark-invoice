
import React from "react";
import { format } from "date-fns";
import { Client } from "@/types";

interface InvoiceClientInfoProps {
  client: Client;
  date: Date;
  dueDate: Date;
  isPDF?: boolean;
  showStatus?: boolean;
}

const InvoiceClientInfo = ({ 
  client, 
  date, 
  dueDate, 
  isPDF = false,
  showStatus = true
}: InvoiceClientInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <div>
        <h3 className={isPDF ? "text-sm font-medium mb-2 text-gray-600" : "text-sm font-medium mb-2 text-muted-foreground"}>
          Bill To:
        </h3>
        <div className={`border-l-2 ${isPDF ? "border-[#3b82f6]" : "border-primary"} pl-3`}>
          <h4 className="font-bold">{client.companyName}</h4>
          <p className="text-sm mt-1">{client.address}</p>
          <p className="text-sm mt-2">GSTIN: {client.gstNumber}</p>
          <p className="text-sm">{client.email}</p>
          <p className="text-sm">{client.phoneNumber}</p>
        </div>
      </div>
      <div className="flex flex-col justify-start gap-3 md:items-end">
        <div className="grid grid-cols-2 gap-x-2 md:text-right">
          <span className={isPDF ? "text-sm text-gray-600" : "text-sm text-muted-foreground"}>Issue Date:</span>
          <span className="font-medium">{format(date, "dd/MM/yyyy")}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-2 md:text-right">
          <span className={isPDF ? "text-sm text-gray-600" : "text-sm text-muted-foreground"}>Due Date:</span>
          <span className="font-medium">{format(dueDate, "dd/MM/yyyy")}</span>
        </div>
        {showStatus && !isPDF && (
          <div className="grid grid-cols-2 gap-x-2 md:text-right mt-4 print-hide">
            <span className="text-sm font-semibold text-muted-foreground">Status:</span>
            <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300 print:hidden">
              Generated
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceClientInfo;
