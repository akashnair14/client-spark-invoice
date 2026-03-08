
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
  compact?: boolean;
}

const InvoiceTemplateFooter = ({ 
  notes, 
  companyDetails, 
  isPDF = false,
  compact = false
}: InvoiceTemplateFooterProps) => {
  if (isPDF) {
    const fontSize = compact ? '0.65rem' : '0.875rem';
    const smallFontSize = compact ? '0.6rem' : '0.75rem';
    return (
      <div style={{marginTop: compact ? '0.5rem' : '2rem', borderTop: '1px solid #e5e7eb', paddingTop: compact ? '0.5rem' : '1rem'}}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: compact ? '1rem' : '2rem',
          marginBottom: compact ? '0.5rem' : '1rem'
        }}>
          <div>
            <h4 style={{fontSize: compact ? '0.7rem' : '0.875rem', fontWeight: '600', marginBottom: '0.25rem', color: '#111827'}}>
              Payment Instructions:
            </h4>
            <p style={{fontSize: smallFontSize, color: '#374151', lineHeight: '1.4'}}>
              Please make payment within the due date. Late payments may incur additional charges.
              For any queries, contact us at {companyDetails.email}
            </p>
          </div>
          <div style={{textAlign: 'right'}}>
            <h4 style={{fontSize: compact ? '0.7rem' : '0.875rem', fontWeight: '600', marginBottom: '0.25rem', color: '#111827'}}>
              Authorized Signature
            </h4>
            <div style={{
              height: compact ? '30px' : '60px',
              borderBottom: '1px solid #374151',
              marginBottom: '0.25rem'
            }}></div>
            <p style={{fontSize: smallFontSize, color: '#374151'}}>
              For {companyDetails.name}
            </p>
          </div>
        </div>
        
        <div style={{
          textAlign: 'center',
          fontSize: smallFontSize,
          color: '#374151',
          borderTop: '1px solid #e5e7eb',
          paddingTop: compact ? '0.35rem' : '1rem'
        }}>
          <p style={{margin: '0'}}>
            This is a computer generated invoice and does not require physical signature.
          </p>
          <p style={{margin: '0.125rem 0 0 0', fontWeight: '600'}}>
            Thank you for your business!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`border-t border-border ${compact ? 'mt-4 pt-3' : 'mt-8 pt-6'}`}>
      
      <div className={`grid grid-cols-1 md:grid-cols-2 ${compact ? 'gap-3 mb-3' : 'gap-6 mb-6'}`}>
        <div>
          <h4 className={`font-semibold text-foreground ${compact ? 'text-xs mb-1' : 'text-sm mb-2'}`}>Payment Instructions:</h4>
          <p className={`text-foreground/70 leading-relaxed ${compact ? 'text-[10px]' : 'text-xs'}`}>
            Please make payment within the due date. Late payments may incur additional charges.
            For any queries, contact us at {companyDetails.email}
          </p>
        </div>
        <div className="md:text-right">
          <h4 className={`font-semibold text-foreground ${compact ? 'text-xs mb-1' : 'text-sm mb-2'}`}>Authorized Signature</h4>
          <div className={`border-b border-foreground/40 mb-1 ${compact ? 'h-8' : 'h-16'}`}></div>
          <p className={`text-foreground/70 ${compact ? 'text-[10px]' : 'text-xs'}`}>For {companyDetails.name}</p>
        </div>
      </div>
      
      <div className={`text-center text-foreground/70 border-t border-border ${compact ? 'text-[10px] pt-2' : 'text-xs pt-4'}`}>
        <p>This is a computer generated invoice and does not require physical signature.</p>
        <p className="mt-0.5 font-semibold text-foreground/80">Thank you for your business!</p>
      </div>
    </div>
  );
};

export default InvoiceTemplateFooter;
