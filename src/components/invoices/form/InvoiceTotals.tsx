
import React from "react";

interface InvoiceTotalsProps {
  subtotal: number;
  gstAmount: number;
  total: number;
}

const InvoiceTotals = ({ subtotal, gstAmount, total }: InvoiceTotalsProps) => {
  return (
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
  );
};

export default InvoiceTotals;
