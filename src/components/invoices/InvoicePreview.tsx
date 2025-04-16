
import React, { useRef } from "react";
import { Client, InvoiceItem } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import InvoiceActions from "./preview/InvoiceActions";
import InvoiceHeader from "./preview/InvoiceHeader";
import InvoiceClientInfo from "./preview/InvoiceClientInfo";
import InvoiceItemsTable from "./preview/InvoiceItemsTable";
import InvoiceTotals from "./preview/InvoiceTotals";
import InvoiceNotes from "./preview/InvoiceNotes";
import InvoiceFooter from "./preview/InvoiceFooter";
import PrintableInvoice from "./preview/PrintableInvoice";

interface InvoicePreviewProps {
  invoice: {
    date: Date;
    dueDate: Date;
    invoiceNumber: string;
    items: InvoiceItem[];
    notes?: string;
    status?: 'draft' | 'sent' | 'paid' | 'pending' | 'overdue';
  };
  client: Client | undefined;
  subtotal: number;
  gstAmount: number;
  roundoff?: number;
  total: number;
}

const InvoicePreview = ({ invoice, client, subtotal, gstAmount, roundoff = 0, total }: InvoicePreviewProps) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const printableRef = useRef<HTMLDivElement>(null);

  if (!client) {
    return <div className="text-center py-8">Please select a client to preview invoice</div>;
  }

  const companyDetails = {
    name: "Your Company Name",
    address: [client.address, client.city || "", client.state || ""],
    gstNumber: client.gstNumber,
    contact: client.email
  };

  return (
    <div className="space-y-6">
      <InvoiceActions
        invoiceRef={invoiceRef}
        printableRef={printableRef}
        invoiceNumber={invoice.invoiceNumber}
        clientName={client.companyName}
        clientPhoneNumber={client.phoneNumber}
        total={total}
        dueDate={invoice.dueDate}
      />

      <Card className="border border-gray-200 print:border-0 print:shadow-none animate-fade-in">
        <CardContent className="p-6 md:p-8" ref={invoiceRef}>
          <div className="invoice-content">
            <InvoiceHeader 
              invoiceNumber={invoice.invoiceNumber} 
              companyDetails={companyDetails}
            />
            <InvoiceClientInfo 
              client={client} 
              date={invoice.date} 
              dueDate={invoice.dueDate}
              status={invoice.status}
            />
            <InvoiceItemsTable items={invoice.items} />
            <InvoiceTotals 
              subtotal={subtotal} 
              gstAmount={gstAmount}
              roundoff={roundoff}
              total={total} 
            />
            <InvoiceNotes notes={invoice.notes} />
            <InvoiceFooter />
          </div>
        </CardContent>
      </Card>

      {/* Hidden printable version without status - only used for PDF generation */}
      <div className="hidden">
        <PrintableInvoice
          ref={printableRef}
          invoice={invoice}
          client={client}
          subtotal={subtotal}
          gstAmount={gstAmount}
          roundoff={roundoff}
          total={total}
        />
      </div>
    </div>
  );
};

export default InvoicePreview;
