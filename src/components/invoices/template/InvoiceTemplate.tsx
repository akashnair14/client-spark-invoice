
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
      logo: "/placeholder.svg", // You can customize this
      address: "123 Business Street",
      city: "Business City",
      state: "Business State",
      postalCode: "12345",
      gstNumber: "27AAPFU0939F1ZV",
      email: "contact@yourcompany.com",
      phone: "+91-9876543210",
      website: "www.yourcompany.com"
    };

    // Ensure we have valid date objects
    const invoiceDate = invoice.date instanceof Date ? invoice.date : 
                       (invoice.date ? new Date(invoice.date) : new Date());
    
    const dueDate = invoice.dueDate instanceof Date ? invoice.dueDate : 
                   (invoice.dueDate ? new Date(invoice.dueDate) : new Date());

    const isCompact = invoice.items.length > 8;
    const isVeryCompact = invoice.items.length > 15;

    return (
      <>
        <style>
          {`
            @media print {
              @page {
                size: A4;
                margin: 10mm;
              }
              body { margin: 0 !important; }
              .print\\:hidden { display: none !important; }
              .invoice-template {
                width: 190mm !important;
                max-height: 277mm !important;
                overflow: hidden !important;
                page-break-inside: avoid !important;
              }
              .invoice-template * {
                background: white !important;
                color: black !important;
              }
              .invoice-template .text-primary {
                color: #3b82f6 !important;
              }
              .invoice-template .border {
                border-color: #e5e7eb !important;
              }
              .invoice-template .bg-primary-foreground {
                background: #f8fafc !important;
              }
            }
          `}
        </style>
        <div 
          ref={ref} 
          className={`invoice-template bg-white text-black ${isPDF ? 'p-6' : 'p-6 md:p-8'}`}
          style={{
            width: isPDF ? '210mm' : '100%',
            maxWidth: '210mm',
            maxHeight: isPDF ? '277mm' : undefined,
            overflow: isPDF ? 'hidden' : undefined,
            margin: '0 auto',
            ...(isPDF ? { background: 'white', color: 'black' } : {}),
          }}
        >
          <InvoiceTemplateHeader 
            companyDetails={companyDetails}
            invoiceNumber={invoice.invoiceNumber}
            isPDF={isPDF}
            compact={isCompact}
          />
          
          <InvoiceTemplateClient 
            client={client}
            date={invoiceDate}
            dueDate={dueDate}
            status={invoice.status}
            isPDF={isPDF}
            compact={isCompact}
          />
          
          <InvoiceTemplateItems 
            items={invoice.items}
            isPDF={isPDF}
            compact={isCompact}
            veryCompact={isVeryCompact}
          />
          
          <InvoiceTemplateTotals 
            subtotal={subtotal}
            gstAmount={gstAmount}
            roundoff={roundoff}
            total={total}
            isPDF={isPDF}
            compact={isCompact}
          />
          
          <InvoiceTemplateFooter 
            notes={invoice.notes}
            companyDetails={companyDetails}
            isPDF={isPDF}
            compact={isCompact}
          />
        </div>
      </>
    );
  }
);

InvoiceTemplate.displayName = "InvoiceTemplate";

export default InvoiceTemplate;
