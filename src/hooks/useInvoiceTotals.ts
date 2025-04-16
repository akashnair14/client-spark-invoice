
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { InvoiceItem } from "@/types";
import { useInvoiceForm } from "@/context/InvoiceFormContext";

/**
 * Calculate and update invoice totals based on item changes
 */
export const useInvoiceTotals = (form: UseFormReturn<any>) => {
  const { updateTotals } = useInvoiceForm();
  const watchItems = form.watch("items");
  
  useEffect(() => {
    const calculateAndUpdateItems = () => {
      // Calculate amounts for each item first
      const updatedItems = watchItems.map(item => ({
        ...item,
        amount: item.quantity * item.rate
      }));
      
      // Update each item's amount in the form
      updatedItems.forEach((item, index) => {
        if (form.getValues(`items.${index}.amount`) !== item.amount) {
          form.setValue(`items.${index}.amount`, item.amount);
        }
      });
      
      // Make sure all items have required properties
      const validItems: InvoiceItem[] = updatedItems
        .filter(item => 
          item && 
          typeof item.quantity === 'number' && 
          typeof item.rate === 'number' &&
          item.id !== undefined
        )
        .map(item => ({
          id: item.id || '',
          description: item.description || '',
          quantity: item.quantity || 0,
          hsnCode: item.hsnCode || '',
          rate: item.rate || 0,
          gstRate: item.gstRate || 0,
          cgstRate: item.cgstRate || 0,
          sgstRate: item.sgstRate || 0,
          amount: item.amount || 0
        }));
      
      // Update the totals in context
      updateTotals(validItems);
    };

    calculateAndUpdateItems();
  }, [watchItems, form, updateTotals]);
};
