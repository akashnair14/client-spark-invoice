
import React from "react";

interface CompanyDetails {
  name: string;
  logo: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  gstNumber: string;
  email: string;
  phone: string;
  website: string;
}

interface InvoiceTemplateFooterProps {
  companyDetails: CompanyDetails;
  isPDF?: boolean;
}

const InvoiceTemplateFooter = ({ 
  companyDetails, 
  isPDF = false
}: InvoiceTemplateFooterProps) => {
  if (isPDF) {
    return (
      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px' }}>
          <div>
            <p style={{ fontSize: '9px', color: '#9ca3af', margin: '0 0 2px 0' }}>Payment Instructions</p>
            <p style={{ fontSize: '9px', color: '#6b7280', lineHeight: '1.4', margin: '0', maxWidth: '280px' }}>
              Please make payment within the due date. For queries, contact {companyDetails.email}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ width: '120px', borderBottom: '1px solid #d1d5db', marginBottom: '4px', height: '32px', marginLeft: 'auto' }}></div>
            <p style={{ fontSize: '9px', color: '#9ca3af', margin: '0' }}>Authorized Signatory</p>
            <p style={{ fontSize: '8px', color: '#9ca3af', margin: '0' }}>For {companyDetails.name}</p>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '6px' }}>
          <p style={{ fontSize: '8px', color: '#9ca3af', margin: '0' }}>
            Computer generated invoice · No signature required · Thank you for your business
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-border pt-4">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-4">
        <div>
          <p className="text-[10px] text-foreground/40 mb-0.5">Payment Instructions</p>
          <p className="text-[10px] text-foreground/50 leading-relaxed max-w-[280px]">
            Please make payment within the due date. For queries, contact {companyDetails.email}
          </p>
        </div>
        <div className="text-right">
          <div className="w-28 border-b border-foreground/30 mb-1 h-8 ml-auto"></div>
          <p className="text-[10px] text-foreground/40">Authorized Signatory</p>
          <p className="text-[9px] text-foreground/40">For {companyDetails.name}</p>
        </div>
      </div>
      
      <div className="text-center border-t border-border/50 pt-2">
        <p className="text-[9px] text-foreground/35">
          Computer generated invoice · No signature required · Thank you for your business
        </p>
      </div>
    </div>
  );
};

export default InvoiceTemplateFooter;
