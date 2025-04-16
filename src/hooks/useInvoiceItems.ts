
import { UseFormReturn } from "react-hook-form";
import { useItemCalculations } from "./useItemCalculations";
import { useGstCalculations } from "./useGstCalculations";
import { useInvoiceTotals } from "./useInvoiceTotals";

/**
 * Main hook for invoice item operations that combines more focused hooks
 */
export const useInvoiceItems = (form: UseFormReturn<any>) => {
  // Setup calculations for item amounts
  const { handleQuantityOrRateChange } = useItemCalculations(form);
  
  // Setup calculations for GST rates
  const { handleGstRateChange, handleCgstSgstChange } = useGstCalculations(form);
  
  // Initialize the invoice totals hook for automatic total calculations
  useInvoiceTotals(form);

  return { 
    handleQuantityOrRateChange,
    handleGstRateChange,
    handleCgstSgstChange
  };
};
