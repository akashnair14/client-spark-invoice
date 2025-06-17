
import React from "react";

interface InvoiceTemplateTotalsProps {
  subtotal: number;
  gstAmount: number;
  roundoff?: number;
  total: number;
  isPDF?: boolean;
}

const InvoiceTemplateTotals = ({ 
  subtotal, 
  gstAmount, 
  roundoff = 0, 
  total, 
  isPDF = false 
}: InvoiceTemplateTotalsProps) => {
  const cgstAmount = gstAmount / 2;
  const sgstAmount = gstAmount / 2;

  if (isPDF) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '2rem'
      }}>
        <div style={{
          width: '300px',
          border: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          <table style={{width: '100%', fontSize: '0.875rem'}}>
            <tbody>
              <tr>
                <td style={{padding: '0.5rem 1rem', borderBottom: '1px solid #e5e7eb'}}>Subtotal:</td>
                <td style={{padding: '0.5rem 1rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb'}}>₹{subtotal.toFixed(2)}</td>
              </tr>
              {cgstAmount > 0 && (
                <tr>
                  <td style={{padding: '0.5rem 1rem', borderBottom: '1px solid #e5e7eb'}}>CGST:</td>
                  <td style={{padding: '0.5rem 1rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb'}}>₹{cgstAmount.toFixed(2)}</td>
                </tr>
              )}
              {sgstAmount > 0 && (
                <tr>
                  <td style={{padding: '0.5rem 1rem', borderBottom: '1px solid #e5e7eb'}}>SGST:</td>
                  <td style={{padding: '0.5rem 1rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb'}}>₹{sgstAmount.toFixed(2)}</td>
                </tr>
              )}
              {roundoff !== 0 && (
                <tr>
                  <td style={{padding: '0.5rem 1rem', borderBottom: '1px solid #e5e7eb'}}>Round Off:</td>
                  <td style={{padding: '0.5rem 1rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb'}}>₹{roundoff.toFixed(2)}</td>
                </tr>
              )}
              <tr style={{backgroundColor: '#3b82f6', color: 'white'}}>
                <td style={{padding: '0.75rem 1rem', fontSize: '1rem', fontWeight: 'bold'}}>Total:</td>
                <td style={{padding: '0.75rem 1rem', textAlign: 'right', fontSize: '1rem', fontWeight: 'bold'}}>₹{total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end mb-8">
      <div className="w-full max-w-sm">
        <div className="bg-muted/30 border rounded-lg overflow-hidden">
          <div className="space-y-0">
            <div className="flex justify-between py-2 px-4 border-b border-border">
              <span className="text-sm">Subtotal:</span>
              <span className="text-sm font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            {cgstAmount > 0 && (
              <div className="flex justify-between py-2 px-4 border-b border-border">
                <span className="text-sm">CGST:</span>
                <span className="text-sm font-medium">₹{cgstAmount.toFixed(2)}</span>
              </div>
            )}
            {sgstAmount > 0 && (
              <div className="flex justify-between py-2 px-4 border-b border-border">
                <span className="text-sm">SGST:</span>
                <span className="text-sm font-medium">₹{sgstAmount.toFixed(2)}</span>
              </div>
            )}
            {roundoff !== 0 && (
              <div className="flex justify-between py-2 px-4 border-b border-border">
                <span className="text-sm">Round Off:</span>
                <span className="text-sm font-medium">₹{roundoff.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between py-3 px-4 bg-primary text-primary-foreground">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-lg">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplateTotals;
