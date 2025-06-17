
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
  const headerStyle = isPDF ? {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    borderBottom: '2px solid #e5e7eb',
    paddingBottom: '1rem'
  } : {};

  const logoStyle = isPDF ? {
    maxWidth: '120px',
    height: 'auto'
  } : {};

  const titleStyle = isPDF ? {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#3b82f6',
    margin: '0 0 0.5rem 0'
  } : {};

  const invoiceNoStyle = isPDF ? {
    fontSize: '1rem',
    color: '#6b7280',
    margin: '0'
  } : {};

  if (isPDF) {
    return (
      <div style={headerStyle}>
        <div>
          <img 
            src={companyDetails.logo} 
            alt={companyDetails.name}
            style={logoStyle}
          />
          <div style={{marginTop: '1rem'}}>
            <h1 style={titleStyle}>{companyDetails.name}</h1>
            <p style={{margin: '0', fontSize: '0.875rem', color: '#6b7280'}}>
              {companyDetails.address}
            </p>
            <p style={{margin: '0', fontSize: '0.875rem', color: '#6b7280'}}>
              {companyDetails.city}, {companyDetails.state} {companyDetails.postalCode}
            </p>
            <p style={{margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#6b7280'}}>
              GST: {companyDetails.gstNumber}
            </p>
          </div>
        </div>
        <div style={{textAlign: 'right'}}>
          <h2 style={titleStyle}>TAX INVOICE</h2>
          <p style={invoiceNoStyle}>Invoice #{invoiceNumber}</p>
          <div style={{marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280'}}>
            <p style={{margin: '0'}}>Email: {companyDetails.email}</p>
            <p style={{margin: '0'}}>Phone: {companyDetails.phone}</p>
            <p style={{margin: '0'}}>Web: {companyDetails.website}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start mb-8 border-b-2 border-primary/20 pb-4">
      <div className="flex items-start space-x-4">
        <img 
          src={companyDetails.logo} 
          alt={companyDetails.name}
          className="w-20 h-20 object-contain"
        />
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">{companyDetails.name}</h1>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>{companyDetails.address}</p>
            <p>{companyDetails.city}, {companyDetails.state} {companyDetails.postalCode}</p>
            <p className="font-medium">GST: {companyDetails.gstNumber}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 md:mt-0 text-right">
        <h2 className="text-2xl font-bold text-primary mb-1">TAX INVOICE</h2>
        <p className="text-lg text-muted-foreground mb-4">Invoice #{invoiceNumber}</p>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Email: {companyDetails.email}</p>
          <p>Phone: {companyDetails.phone}</p>
          <p>Web: {companyDetails.website}</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplateHeader;
