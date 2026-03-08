
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

interface InvoiceTemplateHeaderProps {
  companyDetails: CompanyDetails;
  invoiceNumber: string;
  isPDF?: boolean;
}

const InvoiceTemplateHeader = ({ 
  companyDetails, 
  invoiceNumber, 
  isPDF = false
}: InvoiceTemplateHeaderProps) => {
  if (isPDF) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px',
        paddingBottom: '14px',
        borderBottom: '3px solid #4f46e5'
      }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>
            {companyDetails.name}
          </h1>
          <div style={{ fontSize: '11px', color: '#4b5563', lineHeight: '1.5' }}>
            <p style={{ margin: '0' }}>{companyDetails.address}</p>
            <p style={{ margin: '0' }}>{companyDetails.city}, {companyDetails.state} - {companyDetails.postalCode}</p>
            <p style={{ margin: '2px 0 0 0', fontWeight: '600', color: '#111827' }}>GSTIN: {companyDetails.gstNumber}</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: '#4f46e5',
            color: 'white',
            padding: '6px 16px',
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '2px',
            marginBottom: '6px'
          }}>
            TAX INVOICE
          </div>
          <p style={{ fontSize: '13px', color: '#111827', margin: '4px 0 0 0', fontWeight: '600' }}>
            #{invoiceNumber}
          </p>
          <div style={{ fontSize: '10px', color: '#6b7280', lineHeight: '1.5', marginTop: '6px' }}>
            <p style={{ margin: '0' }}>{companyDetails.email}</p>
            <p style={{ margin: '0' }}>{companyDetails.phone}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start mb-6 pb-4 border-b-[3px] border-primary">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight mb-1">
          {companyDetails.name}
        </h1>
        <div className="text-xs text-foreground/70 leading-relaxed space-y-0.5">
          <p>{companyDetails.address}</p>
          <p>{companyDetails.city}, {companyDetails.state} - {companyDetails.postalCode}</p>
          <p className="font-semibold text-foreground">GSTIN: {companyDetails.gstNumber}</p>
        </div>
      </div>
      
      <div className="mt-3 md:mt-0 text-right">
        <span className="inline-block bg-primary text-primary-foreground px-4 py-1.5 text-xs font-bold tracking-[2px] mb-1.5">
          TAX INVOICE
        </span>
        <p className="text-sm font-semibold text-foreground">#{invoiceNumber}</p>
        <div className="text-[11px] text-foreground/60 mt-1.5 space-y-0.5">
          <p>{companyDetails.email}</p>
          <p>{companyDetails.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplateHeader;
