
import React from "react";

interface InvoiceTotalsProps {
  subtotal: number;
  gstAmount: number;
  total: number;
  isPDF?: boolean;
}

const InvoiceTotals = ({ subtotal, gstAmount, total, isPDF = false }: InvoiceTotalsProps) => {
  if (isPDF) {
    return (
      <div className="flex justify-end mb-8">
        <div className="w-full max-w-xs">
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem'}}>
            <span style={{color: '#6b7280'}}>Subtotal:</span>
            <span style={{textAlign: 'right'}}>₹{subtotal.toFixed(2)}</span>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', padding: '0.5rem 0'}}>
            <span style={{color: '#6b7280'}}>GST:</span>
            <span style={{textAlign: 'right'}}>₹{gstAmount.toFixed(2)}</span>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem', fontWeight: 'bold'}}>
            <span>Total:</span>
            <span style={{textAlign: 'right'}}>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end mb-8">
      <div className="w-full max-w-xs">
        <div className="grid grid-cols-2 gap-2 border-t border-border pt-4">
          <span className="text-muted-foreground">Subtotal:</span>
          <span className="text-right">₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 py-2">
          <span className="text-muted-foreground">GST:</span>
          <span className="text-right">₹{gstAmount.toFixed(2)}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 border-t border-border pt-4 font-bold">
          <span>Total:</span>
          <span className="text-right">₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTotals;
