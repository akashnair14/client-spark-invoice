
import React from "react";
import { useInvoiceForm } from "@/context/InvoiceFormContext";
import { convertNumberToWords } from "@/utils/numberToWords";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const InvoiceTotals = () => {
  const form = useFormContext();
  const { 
    subtotal, 
    gstAmount, 
    roundoff, 
    total, 
    gstType, 
    gstPercentage, 
    setGstPercentage,
    setGstType 
  } = useInvoiceForm();
  
  // Handle GST percentage change
  const handleGstChange = (value: number[]) => {
    setGstPercentage(value[0]);
  };
  
  // Update GST type when form changes
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.gstType) {
        setGstType(value.gstType as "regular" | "igst");
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, setGstType]);
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Invoice Totals</h3>
      
      {/* GST Configuration Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="mb-6">
            <h4 className="text-base font-medium mb-4">GST Structure</h4>
            <RadioGroup
              value={gstType}
              onValueChange={(value) => {
                setGstType(value as "regular" | "igst");
                form.setValue("gstType", value as "regular" | "igst");
              }}
              className="flex flex-row space-x-4 mb-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="regular" id="regular" />
                <Label htmlFor="regular">CGST + SGST</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="igst" id="igst" />
                <Label htmlFor="igst">IGST</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Separator className="my-4" />
          
          {/* GST Percentage Selection */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">GST Rate: {gstPercentage}%</h4>
              <div className="w-1/2">
                <Slider
                  value={[gstPercentage]}
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
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    gstPercentage === rate
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Invoice Calculations */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Assessable Value:</span>
              <span className="font-medium text-right">₹{subtotal.toFixed(2)}</span>
            </div>
            
            {gstType === "regular" ? (
              <>
                <div className="grid grid-cols-3 w-full">
                  <span className="text-muted-foreground">CGST ({gstPercentage/2}%):</span>
                  <span className="text-center"></span>
                  <span className="text-right">₹{(gstAmount/2).toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-3 w-full">
                  <span className="text-muted-foreground">SGST ({gstPercentage/2}%):</span>
                  <span className="text-center"></span>
                  <span className="text-right">₹{(gstAmount/2).toFixed(2)}</span>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-3 w-full">
                <span className="text-muted-foreground">IGST ({gstPercentage}%):</span>
                <span className="text-center"></span>
                <span className="text-right">₹{gstAmount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Round Off:</span>
              <span className="text-right">₹{roundoff.toFixed(2)}</span>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Grand Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
          
          {/* Amount in words */}
          <div className="w-full border-t pt-3 mt-4">
            <p className="text-sm">
              <span className="font-medium">Rupees:</span> {convertNumberToWords(total)} Only
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Terms and conditions */}
      <div className="text-xs text-muted-foreground space-y-1 border-t pt-3">
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
