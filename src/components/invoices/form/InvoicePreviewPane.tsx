
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client, InvoiceItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface InvoicePreviewPaneProps {
  client?: Client;
  invoiceNumber: string;
  date: Date;
  items: InvoiceItem[];
  subtotal: number;
  gstAmount: number;
  total: number;
  gstType: "regular" | "igst";
}

const InvoicePreviewPane = ({ 
  client, 
  invoiceNumber, 
  date, 
  items, 
  subtotal, 
  gstAmount, 
  total, 
  gstType 
}: InvoicePreviewPaneProps) => {
  if (!client) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <p>Select a client to see invoice preview</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Invoice Preview
          <Badge variant="outline">Live Preview</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Header */}
        <div className="text-center border-b pb-4">
          <h2 className="text-xl font-bold">Your Company Name</h2>
          <p className="text-sm text-muted-foreground">Your Company Address</p>
        </div>

        {/* Invoice Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium">Bill To:</h3>
            <p className="text-muted-foreground">{client.companyName}</p>
            <p className="text-xs text-muted-foreground">{client.address}</p>
            <p className="text-xs text-muted-foreground">GST: {client.gstNumber}</p>
          </div>
          <div className="text-right">
            <p><span className="font-medium">Invoice #:</span> {invoiceNumber}</p>
            <p><span className="font-medium">Date:</span> {format(date, 'dd/MM/yyyy')}</p>
            <p><span className="font-medium">GST Type:</span> {gstType.toUpperCase()}</p>
          </div>
        </div>

        {/* Items Preview */}
        <div className="space-y-2">
          <h4 className="font-medium">Items ({items.length})</h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {items.map((item, index) => (
              item.description && (
                <div key={index} className="flex justify-between text-xs p-2 bg-muted/50 rounded">
                  <span className="truncate">{item.description}</span>
                  <span>₹{item.amount.toFixed(2)}</span>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="space-y-1 text-sm border-t pt-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>{gstType === "regular" ? "CGST + SGST" : "IGST"}:</span>
            <span>₹{gstAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium border-t pt-1">
            <span>Total:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoicePreviewPane;
