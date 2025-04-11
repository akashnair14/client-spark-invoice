
import React from "react";

interface InvoiceFooterProps {
  isPDF?: boolean;
}

const InvoiceFooter = ({ isPDF = false }: InvoiceFooterProps) => {
  if (isPDF) {
    return (
      <div style={{borderTop: '1px solid #e5e7eb', marginTop: '2rem', paddingTop: '1rem', textAlign: 'center', fontSize: '0.875rem', color: '#6b7280'}}>
        <p>Thank you for your business!</p>
      </div>
    );
  }

  return (
    <div className="border-t border-border mt-8 pt-4 text-center text-sm text-muted-foreground">
      <p>Thank you for your business!</p>
    </div>
  );
};

export default InvoiceFooter;
