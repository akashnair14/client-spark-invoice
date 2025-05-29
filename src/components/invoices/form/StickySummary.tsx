
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useInvoiceForm } from "@/context/InvoiceFormContext";
import { convertNumberToWords } from "@/utils/numberToWords";
import { Client } from "@/types";

interface StickySummaryProps {
  selectedClient?: Client;
  invoiceNumber: string;
  date: Date;
}

const StickySummary = ({ selectedClient, invoiceNumber, date }: StickySummaryProps) => {
  const { subtotal, gstAmount, roundoff, total, gstType, gstPercentage } = useInvoiceForm();

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          Invoice Summary
          <Badge variant="outline">{gstType === "regular" ? "CGST+SGST" : "IGST"}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Invoice Info */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Invoice No:</span>
            <span className="font-medium">{invoiceNumber || "Auto-generated"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Date:</span>
            <span className="font-medium">{date.toLocaleDateString('en-IN')}</span>
          </div>
          {selectedClient && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Client:</span>
              <span className="font-medium truncate ml-2">{selectedClient.companyName}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Tax Calculations */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Assessable Value:</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          
          {gstType === "regular" ? (
            <>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>CGST ({gstPercentage/2}%):</span>
                <span>₹{(gstAmount/2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>SGST ({gstPercentage/2}%):</span>
                <span>₹{(gstAmount/2).toFixed(2)}</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>IGST ({gstPercentage}%):</span>
              <span>₹{gstAmount.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Round Off:</span>
            <span>₹{roundoff.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="space-y-3">
          <div className="flex justify-between text-lg font-bold">
            <span>Grand Total:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          
          {/* Amount in words */}
          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
            <strong>In Words:</strong> {convertNumberToWords(total)} Only
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StickySummary;
