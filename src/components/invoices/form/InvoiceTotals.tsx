
import React from "react";
import { useInvoiceForm } from "@/context/InvoiceFormContext";
import { convertNumberToWords } from "@/utils/numberToWords";

const InvoiceTotals = () => {
  const { subtotal, gstAmount, total } = useInvoiceForm();
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-end space-y-2">
        <div className="flex items-center w-full max-w-md justify-between">
          <span className="font-medium">Assessable Value:</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        
        <div className="grid grid-cols-3 w-full max-w-md">
          <span className="font-medium">CGST:</span>
          <span className="text-center">{(gstAmount / 2 / subtotal * 100).toFixed(0)}%</span>
          <span className="text-right">₹{(gstAmount / 2).toFixed(2)}</span>
        </div>
        
        <div className="grid grid-cols-3 w-full max-w-md">
          <span className="font-medium">SGST:</span>
          <span className="text-center">{(gstAmount / 2 / subtotal * 100).toFixed(0)}%</span>
          <span className="text-right">₹{(gstAmount / 2).toFixed(2)}</span>
        </div>
        
        <div className="flex items-center w-full max-w-md justify-between text-lg font-bold border-t pt-2 mt-2">
          <span>Grand Total:</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Amount in words */}
      <div className="w-full border-t pt-3 mt-3">
        <p className="text-sm">
          <span className="font-medium">Rupees:</span> {convertNumberToWords(total)}
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
