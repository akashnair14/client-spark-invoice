
import React from "react";
import { Client, InvoiceItem } from "@/types";
import InvoiceTemplateHeader from "./InvoiceTemplateHeader";
import InvoiceTemplateClient from "./InvoiceTemplateClient";
import InvoiceTemplateItems from "./InvoiceTemplateItems";
import InvoiceTemplateTotals from "./InvoiceTemplateTotals";
import InvoiceTemplateFooter from "./InvoiceTemplateFooter";

interface InvoiceTemplateProps {
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
  isPDF?: boolean;
}

const InvoiceTemplate = React.forwardRef<HTMLDivElement, InvoiceTemplateProps>(
  ({ invoice, client, subtotal, gstAmount, roundoff = 0, total, isPDF = false }, ref) => {
    const companyDetails = {
      name: "Your Company Name",
      logo: "/placeholder.svg",
      address: "123 Business Street",
      city: "Business City",
      state: "Business State",
      postalCode: "12345",
      gstNumber: "27AAPFU0939F1ZV",
      email: "contact@yourcompany.com",
      phone: "+91-9876543210",
      website: "www.yourcompany.com"
    };

    const invoiceDate = invoice.date instanceof Date ? invoice.date : 
                       (invoice.date ? new Date(invoice.date) : new Date());
    
    const dueDate = invoice.dueDate instanceof Date ? invoice.dueDate : 
                   (invoice.dueDate ? new Date(invoice.dueDate) : new Date());

    return (
      <>
        <style>
          {`
            @media print {
              @page {
                size: A4;
                margin: 0;
              }
              body { margin: 0 !important; padding: 0 !important; }
              .print\\:hidden { display: none !important; }
              .invoice-template-wrapper {
                width: 210mm !important;
                height: 297mm !important;
                max-height: 297mm !important;
                overflow: hidden !important;
                page-break-inside: avoid !important;
                padding: 12mm 14mm !important;
                box-sizing: border-box !important;
              }
              .invoice-template-wrapper * {
                color-adjust: exact !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          `}
        </style>
        <div 
          ref={ref} 
          className="invoice-template-wrapper bg-white"
          style={{
            maxWidth: isPDF ? '210mm' : undefined,
            maxHeight: isPDF ? '297mm' : undefined,
            overflow: isPDF ? 'hidden' : undefined,
            padding: isPDF ? '12mm 14mm' : undefined,
            boxSizing: 'border-box',
            fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
            color: '#1a1a1a',
            ...(isPDF ? { background: 'white' } : {}),
          }}
        >
          <InvoiceTemplateHeader 
            companyDetails={companyDetails}
            invoiceNumber={invoice.invoiceNumber}
            isPDF={isPDF}
          />
          
          <InvoiceTemplateClient 
            client={client}
            date={invoiceDate}
            dueDate={dueDate}
            status={invoice.status}
            isPDF={isPDF}
          />
          
          <InvoiceTemplateItems 
            items={invoice.items}
            isPDF={isPDF}
          />
          
          <InvoiceTemplateTotals 
            subtotal={subtotal}
            gstAmount={gstAmount}
            roundoff={roundoff}
            total={total}
            isPDF={isPDF}
          />
          
          <InvoiceTemplateFooter 
            companyDetails={companyDetails}
            isPDF={isPDF}
          />
        </div>
      </>
    );
  }
);

InvoiceTemplate.displayName = "InvoiceTemplate";

export default InvoiceTemplate;
