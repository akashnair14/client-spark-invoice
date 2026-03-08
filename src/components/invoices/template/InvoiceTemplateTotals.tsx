
import React from "react";

interface InvoiceTemplateTotalsProps {
  subtotal: number;
  gstAmount: number;
  roundoff?: number;
  total: number;
  isPDF?: boolean;
  compact?: boolean;
}

const InvoiceTemplateTotals = ({ 
  subtotal, 
  gstAmount, 
  roundoff = 0, 
  total, 
  isPDF = false,
  compact = false
}: InvoiceTemplateTotalsProps) => {
  const cgstAmount = gstAmount / 2;
  const sgstAmount = gstAmount / 2;

  if (isPDF) {
    const cellPad = compact ? '0.25rem 0.75rem' : '0.5rem 1rem';
    const fontSize = compact ? '0.75rem' : '0.875rem';
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: compact ? '0.75rem' : '2rem'
      }}>
        <div style={{
          width: '280px',
          border: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          <table style={{width: '100%', fontSize}}>
            <tbody>
              <tr>
                <td style={{padding: cellPad, borderBottom: '1px solid #e5e7eb', color: '#374151'}}>Subtotal:</td>
                <td style={{padding: cellPad, textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontWeight: '600', color: '#111827'}}>₹{subtotal.toFixed(2)}</td>
              </tr>
              {cgstAmount > 0 && (
                <tr>
                  <td style={{padding: cellPad, borderBottom: '1px solid #e5e7eb', color: '#374151'}}>CGST:</td>
                  <td style={{padding: cellPad, textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontWeight: '600', color: '#111827'}}>₹{cgstAmount.toFixed(2)}</td>
                </tr>
              )}
              {sgstAmount > 0 && (
                <tr>
                  <td style={{padding: cellPad, borderBottom: '1px solid #e5e7eb', color: '#374151'}}>SGST:</td>
                  <td style={{padding: cellPad, textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontWeight: '600', color: '#111827'}}>₹{sgstAmount.toFixed(2)}</td>
                </tr>
              )}
              {roundoff !== 0 && (
                <tr>
                  <td style={{padding: cellPad, borderBottom: '1px solid #e5e7eb', color: '#374151'}}>Round Off:</td>
                  <td style={{padding: cellPad, textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontWeight: '600', color: '#111827'}}>₹{roundoff.toFixed(2)}</td>
                </tr>
              )}
              <tr style={{backgroundColor: '#3b82f6', color: 'white'}}>
                <td style={{padding: compact ? '0.35rem 0.75rem' : '0.75rem 1rem', fontSize: compact ? '0.85rem' : '1rem', fontWeight: 'bold'}}>Total:</td>
                <td style={{padding: compact ? '0.35rem 0.75rem' : '0.75rem 1rem', textAlign: 'right', fontSize: compact ? '0.85rem' : '1rem', fontWeight: 'bold'}}>₹{total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex justify-end ${compact ? 'mb-4' : 'mb-8'}`}>
      <div className="w-full max-w-sm">
        <div className="bg-muted/30 border rounded-lg overflow-hidden">
          <div className="space-y-0">
            <div className={`flex justify-between px-4 border-b border-border ${compact ? 'py-1.5' : 'py-2.5'}`}>
              <span className={`text-foreground/80 ${compact ? 'text-xs' : 'text-sm'}`}>Subtotal:</span>
              <span className={`font-semibold text-foreground ${compact ? 'text-xs' : 'text-sm'}`}>₹{subtotal.toFixed(2)}</span>
            </div>
            {cgstAmount > 0 && (
              <div className={`flex justify-between px-4 border-b border-border ${compact ? 'py-1.5' : 'py-2.5'}`}>
                <span className={`text-foreground/80 ${compact ? 'text-xs' : 'text-sm'}`}>CGST:</span>
                <span className={`font-semibold text-foreground ${compact ? 'text-xs' : 'text-sm'}`}>₹{cgstAmount.toFixed(2)}</span>
              </div>
            )}
            {sgstAmount > 0 && (
              <div className={`flex justify-between px-4 border-b border-border ${compact ? 'py-1.5' : 'py-2.5'}`}>
                <span className={`text-foreground/80 ${compact ? 'text-xs' : 'text-sm'}`}>SGST:</span>
                <span className={`font-semibold text-foreground ${compact ? 'text-xs' : 'text-sm'}`}>₹{sgstAmount.toFixed(2)}</span>
              </div>
            )}
            {roundoff !== 0 && (
              <div className={`flex justify-between px-4 border-b border-border ${compact ? 'py-1.5' : 'py-2.5'}`}>
                <span className={`text-foreground/80 ${compact ? 'text-xs' : 'text-sm'}`}>Round Off:</span>
                <span className={`font-semibold text-foreground ${compact ? 'text-xs' : 'text-sm'}`}>₹{roundoff.toFixed(2)}</span>
              </div>
            )}
            <div className={`flex justify-between px-4 bg-primary text-primary-foreground ${compact ? 'py-2' : 'py-3'}`}>
              <span className="font-bold">Total:</span>
              <span className={`font-bold ${compact ? 'text-base' : 'text-lg'}`}>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplateTotals;
