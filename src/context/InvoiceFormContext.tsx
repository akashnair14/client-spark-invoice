
import React, { createContext, useContext, useState, useEffect } from "react";
import { InvoiceItem } from "@/types";
import { calculateSubtotal, calculateGstAmount, calculateTotalAmount } from "@/utils/invoiceUtils";

interface InvoiceFormContextType {
  subtotal: number;
  gstAmount: number;
  total: number;
  updateTotals: (items: InvoiceItem[]) => void;
}

const InvoiceFormContext = createContext<InvoiceFormContextType | undefined>(undefined);

export const InvoiceFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subtotal, setSubtotal] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [total, setTotal] = useState(0);

  const updateTotals = (items: InvoiceItem[]) => {
    // Calculate subtotal
    const newSubtotal = parseFloat(calculateSubtotal(items).toFixed(2));
    setSubtotal(newSubtotal);

    // Calculate GST amount
    const newGstAmount = parseFloat(calculateGstAmount(items).toFixed(2));
    setGstAmount(newGstAmount);

    // Calculate total
    const newTotal = parseFloat((newSubtotal + newGstAmount).toFixed(2));
    setTotal(newTotal);
  };

  const value = {
    subtotal,
    gstAmount,
    total,
    updateTotals
  };

  return (
    <InvoiceFormContext.Provider value={value}>
      {children}
    </InvoiceFormContext.Provider>
  );
};

export const useInvoiceForm = () => {
  const context = useContext(InvoiceFormContext);
  if (context === undefined) {
    throw new Error('useInvoiceForm must be used within an InvoiceFormProvider');
  }
  return context;
};
