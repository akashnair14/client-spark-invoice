
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
  notes?: string;
  companyDetails: CompanyDetails;
  isPDF?: boolean;
}

const InvoiceTemplateFooter = ({ 
  notes, 
  companyDetails, 
  isPDF = false 
}: InvoiceTemplateFooterProps) => {
  if (isPDF) {
    return (
      <div style={{marginTop: '2rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem'}}>
        {notes && (
          <div style={{marginBottom: '1.5rem'}}>
            <h4 style={{fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151'}}>
              Notes & Terms:
            </h4>
            <p style={{fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.5'}}>
              {notes}
            </p>
          </div>
        )}
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          marginBottom: '1rem'
        }}>
          <div>
            <h4 style={{fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151'}}>
              Payment Instructions:
            </h4>
            <p style={{fontSize: '0.75rem', color: '#6b7280', lineHeight: '1.4'}}>
              Please make payment within the due date. Late payments may incur additional charges.
              For any queries, contact us at {companyDetails.email}
            </p>
          </div>
          <div style={{textAlign: 'right'}}>
            <h4 style={{fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151'}}>
              Authorized Signature
            </h4>
            <div style={{
              height: '60px',
              borderBottom: '1px solid #6b7280',
              marginBottom: '0.5rem'
            }}></div>
            <p style={{fontSize: '0.75rem', color: '#6b7280'}}>
              For {companyDetails.name}
            </p>
          </div>
        </div>
        
        <div style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#6b7280',
          borderTop: '1px solid #e5e7eb',
          paddingTop: '1rem'
        }}>
          <p style={{margin: '0'}}>
            This is a computer generated invoice and does not require physical signature.
          </p>
          <p style={{margin: '0.25rem 0 0 0'}}>
            Thank you for your business!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 border-t border-border pt-6">
      {notes && (
        <div className="mb-6">
          <h4 className="text-base font-semibold mb-2 text-foreground">Notes & Terms:</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{notes}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="text-sm font-semibold mb-2 text-foreground">Payment Instructions:</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Please make payment within the due date. Late payments may incur additional charges.
            For any queries, contact us at {companyDetails.email}
          </p>
        </div>
        <div className="md:text-right">
          <h4 className="text-sm font-semibold mb-2 text-foreground">Authorized Signature</h4>
          <div className="h-16 border-b border-muted-foreground/50 mb-2"></div>
          <p className="text-xs text-muted-foreground">For {companyDetails.name}</p>
        </div>
      </div>
      
      <div className="text-center text-xs text-muted-foreground border-t border-border pt-4">
        <p>This is a computer generated invoice and does not require physical signature.</p>
        <p className="mt-1 font-medium">Thank you for your business!</p>
      </div>
    </div>
  );
};

export default InvoiceTemplateFooter;
