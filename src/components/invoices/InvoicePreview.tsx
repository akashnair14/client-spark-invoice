import React, { useRef } from "react";
import { Client, InvoiceItem, Invoice } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import InvoiceActions from "./preview/InvoiceActions";
import InvoiceTemplate from "./template/InvoiceTemplate";
import CustomInvoiceTemplate from "./template/CustomInvoiceTemplate";
import { useInvoiceTemplate } from "@/hooks/useInvoiceTemplate";

interface InvoicePreviewProps {
  invoice: {
    date: Date | string | null;
    dueDate: Date | string | null;
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
  const { templateLayout, isCustomTemplate } = useInvoiceTemplate();

  if (!client) {
    return <div className="text-center py-8">Please select a client to preview invoice</div>;
  }

  // Ensure we have valid date objects
  const invoiceDate = invoice.date instanceof Date ? invoice.date : 
                     (invoice.date ? new Date(invoice.date) : new Date());
  
  const dueDate = invoice.dueDate instanceof Date ? invoice.dueDate : 
                 (invoice.dueDate ? new Date(invoice.dueDate) : new Date());

  return (
    <div className="space-y-6">
      <InvoiceActions
        invoiceRef={invoiceRef}
        printableRef={printableRef}
        invoiceNumber={invoice.invoiceNumber}
        clientName={client.companyName}
        clientPhoneNumber={client.phoneNumber}
        total={total}
        dueDate={dueDate}
      />

      <Card className="border border-gray-200 print:border-0 print:shadow-none animate-fade-in">
        <CardContent className="p-0" ref={invoiceRef}>
          {isCustomTemplate && templateLayout ? (
            <CustomInvoiceTemplate
              layout={templateLayout}
              client={client}
              invoice={{
                invoiceNumber: invoice.invoiceNumber,
                date: typeof invoice.date === 'string' ? invoice.date : invoiceDate.toISOString().split('T')[0],
                dueDate: typeof invoice.dueDate === 'string' ? invoice.dueDate : dueDate.toISOString().split('T')[0],
                subtotal,
                gstAmount,
                total,
                notes: invoice.notes || "",
                status: invoice.status || 'draft',
                id: "",
                clientId: client.id,
                amount: total,
                items: invoice.items,
                clientName: client.companyName,
              }}
              items={invoice.items}
            />
          ) : (
            <InvoiceTemplate
              invoice={{
                ...invoice,
                date: invoiceDate,
                dueDate: dueDate
              }}
              client={client}
              subtotal={subtotal}
              gstAmount={gstAmount}
              roundoff={roundoff}
              total={total}
            />
          )}
        </CardContent>
      </Card>

      {/* Hidden printable version for PDF generation */}
      <div className="hidden">
        {isCustomTemplate && templateLayout ? (
          <CustomInvoiceTemplate
            ref={printableRef}
            layout={templateLayout}
            client={client}
            invoice={{
              invoiceNumber: invoice.invoiceNumber,
              date: typeof invoice.date === 'string' ? invoice.date : invoiceDate.toISOString().split('T')[0],
              dueDate: typeof invoice.dueDate === 'string' ? invoice.dueDate : dueDate.toISOString().split('T')[0],
              subtotal,
              gstAmount,
              total,
              notes: invoice.notes || "",
              status: invoice.status || 'draft',
              id: "",
              clientId: client.id,
              amount: total,
              items: invoice.items,
              clientName: client.companyName,
            }}
            items={invoice.items}
            isPDF={true}
          />
        ) : (
          <InvoiceTemplate
            ref={printableRef}
            invoice={{
              ...invoice,
              date: invoiceDate,
              dueDate: dueDate
            }}
            client={client}
            subtotal={subtotal}
            gstAmount={gstAmount}
            roundoff={roundoff}
            total={total}
            isPDF={true}
          />
        )}
      </div>
    </div>
  );
};

export default InvoicePreview;