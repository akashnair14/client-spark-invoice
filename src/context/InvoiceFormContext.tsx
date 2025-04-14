
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
    const newSubtotal = calculateSubtotal(items);
    setSubtotal(newSubtotal);

    // Calculate GST amount
    const newGstAmount = calculateGstAmount(items);
    setGstAmount(newGstAmount);

    // Calculate total
    setTotal(newSubtotal + newGstAmount);
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
