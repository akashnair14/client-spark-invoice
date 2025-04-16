
import { UseFormReturn } from "react-hook-form";

/**
 * Handle GST-related calculations and updates
 */
export const useGstCalculations = (form: UseFormReturn<any>) => {
  const handleGstRateChange = (index: number, gstRate: number) => {
    // Set CGST and SGST to half of GST by default
    const halfGstRate = gstRate / 2;
    form.setValue(`items.${index}.cgstRate`, halfGstRate);
    form.setValue(`items.${index}.sgstRate`, halfGstRate);
    
    // Force a re-render to update totals
    form.trigger(`items.${index}`);
  };

  const handleCgstSgstChange = (index: number) => {
    // Update total GST rate based on CGST and SGST
    const cgstRate = form.getValues(`items.${index}.cgstRate`) || 0;
    const sgstRate = form.getValues(`items.${index}.sgstRate`) || 0;
    form.setValue(`items.${index}.gstRate`, cgstRate + sgstRate);
    
    // Force a re-render to update totals
    form.trigger(`items.${index}`);
  };

  return { handleGstRateChange, handleCgstSgstChange };
};
