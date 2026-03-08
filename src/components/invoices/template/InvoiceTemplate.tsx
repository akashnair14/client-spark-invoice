
import React from "react";
import { Client, InvoiceItem } from "@/types";
import InvoiceTemplateHeader from "./InvoiceTemplateHeader";
import InvoiceTemplateClient from "./InvoiceTemplateClient";
import InvoiceTemplateItems from "./InvoiceTemplateItems";
import InvoiceTemplateTotals from "./InvoiceTemplateTotals";
import InvoiceTemplateFooter from "./InvoiceTemplateFooter";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";

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
    const { profile } = useCompanyProfile();

    const companyDetails = {
      name: profile.company_name || "Your Company Name",
      logo: profile.company_logo_url || "/placeholder.svg",
      address: profile.company_address || "123 Business Street",
      city: profile.company_city || "Business City",
      state: profile.company_state || "Business State",
      postalCode: profile.company_postal_code || "12345",
      gstNumber: profile.company_gst_number || "27AAPFU0939F1ZV",
      email: profile.company_email || "contact@yourcompany.com",
      phone: profile.company_phone || "+91-9876543210",
      website: profile.company_website || "www.yourcompany.com",
    };

    const invoiceDate = invoice.date instanceof Date ? invoice.date : 
                       (invoice.date ? new Date(invoice.date) : new Date());
    
    const dueDate = invoice.dueDate instanceof Date ? invoice.dueDate : 
                   (invoice.dueDate ? new Date(invoice.dueDate) : new Date());

    return (
      <div 
        ref={ref} 
        className={`invoice-template-wrapper bg-white ${!isPDF ? 'p-6 md:p-8' : ''}`}
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
    );
  }
);

InvoiceTemplate.displayName = "InvoiceTemplate";

export default InvoiceTemplate;
