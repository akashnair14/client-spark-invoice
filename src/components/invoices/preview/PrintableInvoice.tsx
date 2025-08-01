
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
    date: Date | string | null;
    dueDate: Date | string | null;
    invoiceNumber: string;
    items: InvoiceItem[];
    notes?: string;
    status?: 'draft' | 'sent' | 'paid' | 'pending' | 'overdue';
  };
  client: Client;
  subtotal: number;
  gstAmount: number;
  roundoff?: number;
  total: number;
}

const PrintableInvoice = React.forwardRef<HTMLDivElement, PrintableInvoiceProps>(
  ({ invoice, client, subtotal, gstAmount, roundoff = 0, total }, ref) => {
    // Calculate CGST and SGST (each is half of the total GST)
    const cgstAmount = gstAmount / 2;
    const sgstAmount = gstAmount / 2;
    
    const companyDetails = {
      name: "Your Company Name",
      address: [client.address, client.city || "", client.state || ""],
      gstNumber: client.gstNumber,
      contact: client.email
    };

    // Ensure we have valid date objects
    const invoiceDate = invoice.date instanceof Date ? invoice.date : 
                       (invoice.date ? new Date(invoice.date) : new Date());
    
    const dueDate = invoice.dueDate instanceof Date ? invoice.dueDate : 
                   (invoice.dueDate ? new Date(invoice.dueDate) : new Date());

    return (
      <div ref={ref} className="p-6 md:p-8 bg-white">
        <InvoiceHeader 
          invoiceNumber={invoice.invoiceNumber} 
          isPDF={true}
          companyDetails={companyDetails}
        />
        <InvoiceClientInfo 
          client={client} 
          date={invoiceDate} 
          dueDate={dueDate} 
          isPDF={true}
          showStatus={false}
          status={invoice.status}
        />
        <InvoiceItemsTable items={invoice.items} isPDF={true} />
        <InvoiceTotals 
          subtotal={subtotal} 
          gstAmount={gstAmount}
          roundoff={roundoff}
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
