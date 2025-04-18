
import React from "react";
import { useInvoiceForm } from "@/context/InvoiceFormContext";
import { convertNumberToWords } from "@/utils/numberToWords";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { Slider } from "@/components/ui/slider";

const InvoiceTotals = () => {
  const form = useFormContext();
  const { subtotal, gstAmount, roundoff, total, gstType, gstPercentage, setGstPercentage } = useInvoiceForm();
  
  // Handle GST percentage change
  const handleGstChange = (value: number[]) => {
    setGstPercentage(value[0]);
  };
  
  // Update GST type when form changes
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.gstType) {
        useInvoiceForm().setGstType(value.gstType as "regular" | "igst");
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Invoice Totals</h3>
      
      {/* GST Percentage Selection */}
      <div className="space-y-4 border p-4 rounded-md">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">GST Rate: {gstPercentage}%</h4>
          <div className="w-1/2">
            <Slider
              defaultValue={[gstPercentage]}
              max={28}
              step={1}
              onValueChange={handleGstChange}
              className="w-full"
            />
          </div>
        </div>
        
        {/* Quick GST Rate Buttons */}
        <div className="flex flex-wrap gap-2">
          {[0, 5, 12, 18, 28].map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => setGstPercentage(rate)}
              className={`px-3 py-1 text-xs rounded-full border ${
                gstPercentage === rate
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-muted"
              }`}
            >
              {rate}%
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col items-end space-y-2">
        <div className="flex items-center w-full max-w-md justify-between">
          <span className="font-medium">Assessable Value:</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        
        {gstType === "regular" ? (
          <>
            <div className="grid grid-cols-3 w-full max-w-md">
              <span className="font-medium">CGST ({gstPercentage/2}%):</span>
              <span className="text-center"></span>
              <span className="text-right">₹{(gstAmount/2).toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-3 w-full max-w-md">
              <span className="font-medium">SGST ({gstPercentage/2}%):</span>
              <span className="text-center"></span>
              <span className="text-right">₹{(gstAmount/2).toFixed(2)}</span>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-3 w-full max-w-md">
            <span className="font-medium">IGST ({gstPercentage}%):</span>
            <span className="text-center"></span>
            <span className="text-right">₹{gstAmount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex items-center w-full max-w-md justify-between">
          <span className="font-medium">Round Off:</span>
          <span>₹{roundoff.toFixed(2)}</span>
        </div>
        
        <div className="flex items-center w-full max-w-md justify-between text-lg font-bold border-t pt-2 mt-2">
          <span>Grand Total:</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Amount in words */}
      <div className="w-full border-t pt-3 mt-3">
        <p className="text-sm">
          <span className="font-medium">Rupees:</span> {convertNumberToWords(total)} Only
        </p>
      </div>

      {/* Terms and conditions */}
      <div className="text-xs text-muted-foreground space-y-1 border-t pt-3 mt-3">
        <p className="font-medium">Terms & Conditions:</p>
        <ol className="list-decimal list-inside space-y-1 pl-2">
          <li>If any difference is found in Qty, quality and rate etc. it should be notified within 48 hrs.</li>
          <li>Interest will be charged @24% per Annum on the unpaid amount.</li>
          <li>Subject to local jurisdiction.</li>
        </ol>
      </div>
    </div>
  );
};

export default InvoiceTotals;
