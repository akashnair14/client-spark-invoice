
import React from "react";
import { Client, InvoiceItem } from "@/types";
import InvoiceHeader from "./InvoiceHeader";
import InvoiceClientInfo from "./InvoiceClientInfo";
import InvoiceItemsTable from "./InvoiceItemsTable";
import InvoiceTotals from "./InvoiceTotals";
import InvoiceNotes from "./InvoiceNotes";
import InvoiceFooter from "./InvoiceFooter";

interface PrintableInvoiceProps {
  invoice: {
    date: Date;
    dueDate: Date;
    invoiceNumber: string;
    items: InvoiceItem[];
    notes?: string;
    status?: 'draft' | 'sent' | 'paid' | 'pending' | 'overdue';
  };
  client: Client;
  subtotal: number;
  gstAmount: number;
  total: number;
}

const PrintableInvoice = React.forwardRef<HTMLDivElement, PrintableInvoiceProps>(
  ({ invoice, client, subtotal, gstAmount, total }, ref) => {
    const companyDetails = {
      name: "Your Company Name",
      address: [client.address, client.city || "", client.state || ""],
      gstNumber: client.gstNumber,
      contact: client.email
    };

    return (
      <div ref={ref} className="p-6 md:p-8 bg-white">
        <InvoiceHeader 
          invoiceNumber={invoice.invoiceNumber} 
          isPDF={true}
          companyDetails={companyDetails}
        />
        <InvoiceClientInfo 
          client={client} 
          date={invoice.date} 
          dueDate={invoice.dueDate} 
          isPDF={true}
          showStatus={false}
        />
        <InvoiceItemsTable items={invoice.items} isPDF={true} />
        <InvoiceTotals 
          subtotal={subtotal} 
          gstAmount={gstAmount} 
          total={total} 
          isPDF={true}
        />
        <InvoiceNotes notes={invoice.notes} isPDF={true} />
        <InvoiceFooter isPDF={true} />
      </div>
    );
  }
);

PrintableInvoice.displayName = "PrintableInvoice";

export default PrintableInvoice;
