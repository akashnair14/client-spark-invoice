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
  compact?: boolean;
}

const InvoiceTemplateHeader = ({ 
  companyDetails, 
  invoiceNumber, 
  isPDF = false,
  compact = false
}: InvoiceTemplateHeaderProps) => {
  if (isPDF) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: compact ? '0.75rem' : '2rem',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: compact ? '0.5rem' : '1rem'
      }}>
        <div>
          <img 
            src={companyDetails.logo} 
            alt={companyDetails.name}
            style={{ maxWidth: compact ? '80px' : '120px', height: 'auto' }}
          />
          <div style={{marginTop: compact ? '0.5rem' : '1rem'}}>
            <h1 style={{ fontSize: compact ? '1.25rem' : '2rem', fontWeight: 'bold', color: '#3b82f6', margin: '0 0 0.25rem 0' }}>{companyDetails.name}</h1>
            <p style={{margin: '0', fontSize: compact ? '0.75rem' : '0.875rem', color: '#374151'}}>
              {companyDetails.address}
            </p>
            <p style={{margin: '0', fontSize: compact ? '0.75rem' : '0.875rem', color: '#374151'}}>
              {companyDetails.city}, {companyDetails.state} {companyDetails.postalCode}
            </p>
            <p style={{margin: '0.25rem 0 0 0', fontSize: compact ? '0.75rem' : '0.875rem', color: '#111827', fontWeight: '600'}}>
              GST: {companyDetails.gstNumber}
            </p>
          </div>
        </div>
        <div style={{textAlign: 'right'}}>
          <h2 style={{ fontSize: compact ? '1.25rem' : '2rem', fontWeight: 'bold', color: '#3b82f6', margin: '0 0 0.25rem 0' }}>TAX INVOICE</h2>
          <p style={{ fontSize: compact ? '0.8rem' : '1rem', color: '#374151', margin: '0' }}>Invoice #{invoiceNumber}</p>
          <div style={{marginTop: compact ? '0.5rem' : '1rem', fontSize: compact ? '0.7rem' : '0.875rem', color: '#374151'}}>
            <p style={{margin: '0'}}>Email: {companyDetails.email}</p>
            <p style={{margin: '0'}}>Phone: {companyDetails.phone}</p>
            <p style={{margin: '0'}}>Web: {companyDetails.website}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col md:flex-row justify-between items-start border-b-2 border-primary/20 ${compact ? 'mb-4 pb-2' : 'mb-8 pb-4'}`}>
      <div className="flex items-start space-x-4">
        <img 
          src={companyDetails.logo} 
          alt={companyDetails.name}
          className={compact ? "w-14 h-14 object-contain" : "w-20 h-20 object-contain"}
        />
        <div>
          <h1 className={`font-bold text-primary ${compact ? 'text-xl mb-1' : 'text-3xl mb-2'}`}>{companyDetails.name}</h1>
          <div className={`text-foreground/80 space-y-0.5 ${compact ? 'text-xs' : 'text-sm'}`}>
            <p>{companyDetails.address}</p>
            <p>{companyDetails.city}, {companyDetails.state} {companyDetails.postalCode}</p>
            <p className="font-semibold text-foreground">GST: {companyDetails.gstNumber}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 md:mt-0 text-right">
        <h2 className={`font-bold text-primary ${compact ? 'text-xl mb-0.5' : 'text-2xl mb-1'}`}>TAX INVOICE</h2>
        <p className={`text-foreground/80 ${compact ? 'text-sm mb-2' : 'text-lg mb-4'}`}>Invoice #{invoiceNumber}</p>
        <div className={`text-foreground/80 space-y-0.5 ${compact ? 'text-xs' : 'text-sm'}`}>
          <p>Email: {companyDetails.email}</p>
          <p>Phone: {companyDetails.phone}</p>
          <p>Web: {companyDetails.website}</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplateHeader;
