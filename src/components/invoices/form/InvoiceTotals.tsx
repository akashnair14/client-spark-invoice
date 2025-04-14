
import React from "react";
import { convertNumberToWords } from "@/utils/numberToWords";

interface InvoiceTotalsProps {
  subtotal: number;
  gstAmount: number;
  total: number;
}

const InvoiceTotals = ({ subtotal, gstAmount, total }: InvoiceTotalsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-end space-y-2">
        <div className="flex items-center w-full max-w-md justify-between">
          <span className="font-medium">Subtotal:</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center w-full max-w-md justify-between">
          <span className="font-medium">GST:</span>
          <span>₹{gstAmount.toFixed(2)}</span>
        </div>
        <div className="flex items-center w-full max-w-md justify-between text-lg font-bold">
          <span>Total:</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Amount in words */}
      <div className="w-full border-t pt-3 mt-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">Amount in words:</span> {convertNumberToWords(total)}
        </p>
      </div>
    </div>
  );
};

export default InvoiceTotals;
