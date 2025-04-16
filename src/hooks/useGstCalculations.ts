
import { UseFormReturn } from "react-hook-form";

/**
 * Handle GST-related calculations and updates
 */
export const useGstCalculations = (form: UseFormReturn<any>) => {
  const handleGstRateChange = (index: number, gstRate: number) => {
    // Set CGST and SGST to half of GST by default
    const halfGstRate = parseFloat((gstRate / 2).toFixed(2));
    form.setValue(`items.${index}.cgstRate`, halfGstRate);
    form.setValue(`items.${index}.sgstRate`, halfGstRate);
    
    // Force a re-render to update totals
    form.trigger(`items.${index}`);
  };

  const handleCgstSgstChange = (index: number) => {
    // Update total GST rate based on CGST and SGST
    const cgstRate = Number(form.getValues(`items.${index}.cgstRate`)) || 0;
    const sgstRate = Number(form.getValues(`items.${index}.sgstRate`)) || 0;
    form.setValue(`items.${index}.gstRate`, parseFloat((cgstRate + sgstRate).toFixed(2)));
    
    // Force a re-render to update totals
    form.trigger(`items.${index}`);
  };

  return { handleGstRateChange, handleCgstSgstChange };
};
