
import React from "react";
import { convertNumberToWords } from "@/utils/numberToWords";

interface InvoiceTotalsProps {
  subtotal: number;
  gstAmount: number;
  roundoff?: number;
  total: number;
  isPDF?: boolean;
}

const InvoiceTotals = ({ subtotal, gstAmount, roundoff = 0, total, isPDF = false }: InvoiceTotalsProps) => {
  if (isPDF) {
    return (
      <div className="flex flex-col mb-8">
        <div className="flex justify-end">
          <div className="w-full max-w-xs">
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem'}}>
              <span style={{color: '#6b7280'}}>Assessable Value:</span>
              <span></span>
              <span style={{textAlign: 'right'}}>₹{subtotal.toFixed(2)}</span>
            </div>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', padding: '0.5rem 0'}}>
              <span style={{color: '#6b7280'}}>CGST:</span>
              <span style={{textAlign: 'center'}}>{(gstAmount / 2 / subtotal * 100).toFixed(0)}%</span>
              <span style={{textAlign: 'right'}}>₹{(gstAmount / 2).toFixed(2)}</span>
            </div>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', padding: '0.5rem 0'}}>
              <span style={{color: '#6b7280'}}>SGST:</span>
              <span style={{textAlign: 'center'}}>{(gstAmount / 2 / subtotal * 100).toFixed(0)}%</span>
              <span style={{textAlign: 'right'}}>₹{(gstAmount / 2).toFixed(2)}</span>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', padding: '0.5rem 0'}}>
              <span style={{color: '#6b7280'}}>Round Off:</span>
              <span></span>
              <span style={{textAlign: 'right'}}>₹{roundoff.toFixed(2)}</span>
            </div>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem', fontWeight: 'bold'}}>
              <span>Grand Total:</span>
              <span></span>
              <span style={{textAlign: 'right'}}>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {/* Amount in words for PDF */}
        <div style={{marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb'}}>
          <p style={{fontSize: '0.875rem', color: '#6b7280'}}>
            <span style={{fontWeight: '500'}}>Rupees:</span> {convertNumberToWords(total)} Only
          </p>
        </div>
        
        {/* Terms and conditions */}
        <div style={{fontSize: '0.75rem', color: '#6b7280', marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb'}}>
          <p style={{fontWeight: '500'}}>Terms & Conditions:</p>
          <ol style={{paddingLeft: '1.25rem', marginTop: '0.25rem'}}>
            <li>If any difference is found in Qty, quality and rate etc. it should be notified within 48 hrs.</li>
            <li>Interest will be charged @24% per Annum on the unpaid amount.</li>
            <li>Subject to local jurisdiction.</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mb-8">
      <div className="flex justify-end">
        <div className="w-full max-w-xs">
          <div className="grid grid-cols-3 gap-2 border-t border-border pt-4">
            <span className="text-muted-foreground">Assessable Value:</span>
            <span></span>
            <span className="text-right">₹{subtotal.toFixed(2)}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 py-2">
            <span className="text-muted-foreground">CGST:</span>
            <span className="text-center">{(gstAmount / 2 / subtotal * 100).toFixed(0)}%</span>
            <span className="text-right">₹{(gstAmount / 2).toFixed(2)}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 py-2">
            <span className="text-muted-foreground">SGST:</span>
            <span className="text-center">{(gstAmount / 2 / subtotal * 100).toFixed(0)}%</span>
            <span className="text-right">₹{(gstAmount / 2).toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 py-2">
            <span className="text-muted-foreground">Round Off:</span>
            <span></span>
            <span className="text-right">₹{roundoff.toFixed(2)}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 border-t border-border pt-4 font-bold">
            <span>Grand Total:</span>
            <span></span>
            <span className="text-right">₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {/* Amount in words */}
      <div className="mt-4 pt-2 border-t border-border">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">Rupees:</span> {convertNumberToWords(total)} Only
        </p>
      </div>
      
      {/* Terms and conditions */}
      <div className="text-xs text-muted-foreground space-y-1 border-t pt-3 mt-3">
        <p className="font-medium">Terms & Conditions:</p>
        <ol className="list-decimal list-inside space-y-1 pl-2">
          <li>If any difference is found in Qty, quality and rate etc. it should be notified within 48 hrs.</li>
          <li>Interest will be charged @24% per Annum on the unpaid amount.</li>
          <li>Subject to local jurisdiction.</li>
        </ol>
      </div>
    </div>
  );
};

export default InvoiceTotals;
