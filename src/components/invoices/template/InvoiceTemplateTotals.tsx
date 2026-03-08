
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px' }}>
        <table style={{ width: '220px', fontSize: '11px', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '4px 0', color: '#6b7280' }}>Subtotal</td>
              <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: '500', color: '#111827' }}>₹{subtotal.toFixed(2)}</td>
            </tr>
            {cgstAmount > 0 && (
              <tr>
                <td style={{ padding: '4px 0', color: '#6b7280' }}>CGST</td>
                <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: '500', color: '#111827' }}>₹{cgstAmount.toFixed(2)}</td>
              </tr>
            )}
            {sgstAmount > 0 && (
              <tr>
                <td style={{ padding: '4px 0', color: '#6b7280' }}>SGST</td>
                <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: '500', color: '#111827' }}>₹{sgstAmount.toFixed(2)}</td>
              </tr>
            )}
            {roundoff !== 0 && (
              <tr>
                <td style={{ padding: '4px 0', color: '#6b7280' }}>Round Off</td>
                <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: '500', color: '#111827' }}>₹{roundoff.toFixed(2)}</td>
              </tr>
            )}
            <tr style={{ borderTop: '2px solid #4f46e5' }}>
              <td style={{ padding: '8px 0 0 0', fontSize: '13px', fontWeight: '800', color: '#4f46e5' }}>Total</td>
              <td style={{ padding: '8px 0 0 0', textAlign: 'right', fontSize: '13px', fontWeight: '800', color: '#4f46e5' }}>₹{total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="flex justify-end mb-6">
      <div className="w-full max-w-[240px]">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-xs text-foreground/60">Subtotal</span>
            <span className="text-xs font-medium text-foreground">₹{subtotal.toFixed(2)}</span>
          </div>
          {cgstAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-xs text-foreground/60">CGST</span>
              <span className="text-xs font-medium text-foreground">₹{cgstAmount.toFixed(2)}</span>
            </div>
          )}
          {sgstAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-xs text-foreground/60">SGST</span>
              <span className="text-xs font-medium text-foreground">₹{sgstAmount.toFixed(2)}</span>
            </div>
          )}
          {roundoff !== 0 && (
            <div className="flex justify-between">
              <span className="text-xs text-foreground/60">Round Off</span>
              <span className="text-xs font-medium text-foreground">₹{roundoff.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t-2 border-primary pt-2 mt-1">
            <div className="flex justify-between">
              <span className="text-sm font-extrabold text-primary">Total</span>
              <span className="text-sm font-extrabold text-primary">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplateTotals;
