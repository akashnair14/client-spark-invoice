
import { UseFormReturn } from "react-hook-form";
import { InvoiceItem } from "@/types";

/**
 * Handle quantity or rate changes for an invoice item
 */
export const useItemCalculations = (form: UseFormReturn<any>) => {
  const handleQuantityOrRateChange = (index: number) => {
    const items = form.getValues("items");
    const item = items[index];
    
    if (item.quantity && item.rate) {
      const amount = item.quantity * item.rate;
      form.setValue(`items.${index}.amount`, amount);
      
      // Force a re-render to update totals
      form.trigger(`items.${index}`);
    }
  };

  return { handleQuantityOrRateChange };
};
