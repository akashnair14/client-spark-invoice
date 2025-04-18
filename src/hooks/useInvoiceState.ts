
import { useState } from "react";
import { Client, Invoice, InvoiceItem } from "@/types";
import { calculateSubtotal, calculateGstAmount, calculateRoundoff, calculateTotalAmount } from "@/utils/invoiceUtils";

export const useInvoiceState = () => {
  const [activeTab, setActiveTab] = useState("edit");
  const [selectedClient, setSelectedClient] = useState<Client | undefined>(undefined);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [subtotal, setSubtotal] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [roundoff, setRoundoff] = useState(0);
  const [total, setTotal] = useState(0);

  const calculateInvoiceTotals = (items: InvoiceItem[]) => {
    const newSubtotal = calculateSubtotal(items);
    const newGstAmount = calculateGstAmount(items);
    const newRoundoff = calculateRoundoff(newSubtotal, newGstAmount);
    const newTotal = calculateTotalAmount(items);

    setSubtotal(newSubtotal);
    setGstAmount(newGstAmount);
    setRoundoff(newRoundoff);
    setTotal(newTotal);
  };

  return {
    activeTab,
    setActiveTab,
    selectedClient,
    setSelectedClient,
    invoiceData,
    setInvoiceData,
    subtotal,
    gstAmount,
    roundoff,
    total,
    calculateInvoiceTotals
  };
};
