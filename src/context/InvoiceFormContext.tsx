
import React, { createContext, useContext, useState, useEffect } from "react";
import { InvoiceItem } from "@/types";
import { calculateSubtotal, calculateGstAmount, calculateTotalAmount } from "@/utils/invoiceUtils";

interface InvoiceFormContextType {
  subtotal: number;
  gstAmount: number;
  roundoff: number;
  total: number;
  gstType: "regular" | "igst";
  gstPercentage: number;
  updateTotals: (items: InvoiceItem[]) => void;
  setGstType: (type: "regular" | "igst") => void;
  setGstPercentage: (percentage: number) => void;
}

const InvoiceFormContext = createContext<InvoiceFormContextType | undefined>(undefined);

export const InvoiceFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subtotal, setSubtotal] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [roundoff, setRoundoff] = useState(0);
  const [total, setTotal] = useState(0);
  const [gstType, setGstType] = useState<"regular" | "igst">("regular");
  const [gstPercentage, setGstPercentage] = useState(18); // Default 18%

  // Calculate tax based on subtotal and GST percentage
  useEffect(() => {
    if (subtotal > 0) {
      const newGstAmount = parseFloat((subtotal * (gstPercentage / 100)).toFixed(2));
      setGstAmount(newGstAmount);
      
      // Calculate exact total with GST
      const exactTotal = parseFloat((subtotal + newGstAmount).toFixed(2));
      
      // Calculate roundoff value (to nearest integer)
      const roundedTotal = Math.round(exactTotal);
      const newRoundoff = parseFloat((roundedTotal - exactTotal).toFixed(2));
      setRoundoff(newRoundoff);
      
      // Calculate final total with roundoff
      const newTotal = parseFloat((exactTotal + newRoundoff).toFixed(2));
      setTotal(newTotal);
    }
  }, [subtotal, gstPercentage]);

  const updateTotals = (items: InvoiceItem[]) => {
    // Calculate subtotal
    const newSubtotal = parseFloat(calculateSubtotal(items).toFixed(2));
    setSubtotal(newSubtotal);

    // GST amount will be calculated in the effect
  };

  const value = {
    subtotal,
    gstAmount,
    roundoff,
    total,
    gstType,
    gstPercentage,
    updateTotals,
    setGstType,
    setGstPercentage
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
