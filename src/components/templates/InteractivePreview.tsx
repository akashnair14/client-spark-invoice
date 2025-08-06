import { useState } from "react";
import { format } from "date-fns";
import { TemplateLayout } from "@/types/template";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Download, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  clientName: string;
  clientAddress: string;
  clientGST: string;
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  notes: string;
  discount: number;
  tax: number;
}

interface InteractivePreviewProps {
  layout: TemplateLayout;
  companySettings: any;
  onExportPDF: (data: InvoiceData) => void;
  onPrint: (data: InvoiceData) => void;
}

export const InteractivePreview = ({ 
  layout, 
  companySettings, 
  onExportPDF, 
  onPrint 
}: InteractivePreviewProps) => {
  const { toast } = useToast();
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: `INV-${Date.now()}`,
    date: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    clientName: '',
    clientAddress: '',
    clientGST: '',
    items: [
      { id: '1', description: '', quantity: 1, rate: 0, amount: 0 }
    ],
    notes: '',
    discount: 0,
    tax: 18,
  });

  const updateInvoiceData = (field: keyof InvoiceData, value: any) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const removeItem = (id: string) => {
    if (invoiceData.items.length === 1) {
      toast({
        title: "Cannot remove",
        description: "At least one item is required",
        variant: "destructive",
      });
      return;
    }
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }));
  };

  const updateItem = (id: string, field: string, value: any) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updated.amount = updated.quantity * updated.rate;
          }
          return updated;
        }
        return item;
      }),
    }));
  };

  const calculateTotals = () => {
    const subtotal = invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
    const discountAmount = (subtotal * invoiceData.discount) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * invoiceData.tax) / 100;
    const total = taxableAmount + taxAmount;

    return { subtotal, discountAmount, taxAmount, total };
  };

  const totals = calculateTotals();

  return (
    <div className="h-full flex">
      {/* Editor Panel */}
      <div className="w-1/3 border-r border-border bg-background overflow-y-auto">
        <div className="p-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="invoice-number" className="text-xs">Invoice Number</Label>
                  <Input
                    id="invoice-number"
                    value={invoiceData.invoiceNumber}
                    onChange={(e) => updateInvoiceData('invoiceNumber', e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-xs">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={invoiceData.date}
                    onChange={(e) => updateInvoiceData('date', e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="due-date" className="text-xs">Due Date</Label>
                <Input
                  id="due-date"
                  type="date"
                  value={invoiceData.dueDate}
                  onChange={(e) => updateInvoiceData('dueDate', e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client-name" className="text-xs">Client Name</Label>
                <Input
                  id="client-name"
                  value={invoiceData.clientName}
                  onChange={(e) => updateInvoiceData('clientName', e.target.value)}
                  placeholder="Client Company Name"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-address" className="text-xs">Client Address</Label>
                <Textarea
                  id="client-address"
                  value={invoiceData.clientAddress}
                  onChange={(e) => updateInvoiceData('clientAddress', e.target.value)}
                  placeholder="Client Address"
                  className="min-h-16 text-sm resize-none"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-gst" className="text-xs">GST Number</Label>
                <Input
                  id="client-gst"
                  value={invoiceData.clientGST}
                  onChange={(e) => updateInvoiceData('clientGST', e.target.value)}
                  placeholder="Client GST Number"
                  className="h-8 text-sm"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Items</CardTitle>
                <Button size="sm" variant="outline" onClick={addItem}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {invoiceData.items.map((item, index) => (
                <div key={item.id} className="space-y-2 p-3 border border-border rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium">Item {index + 1}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeItem(item.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Description"
                    className="h-7 text-xs"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                      placeholder="Qty"
                      className="h-7 text-xs"
                    />
                    <Input
                      type="number"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                      placeholder="Rate"
                      className="h-7 text-xs"
                    />
                    <Input
                      value={item.amount.toFixed(2)}
                      readOnly
                      placeholder="Amount"
                      className="h-7 text-xs bg-muted"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Additional Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="discount" className="text-xs">Discount (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    value={invoiceData.discount}
                    onChange={(e) => updateInvoiceData('discount', Number(e.target.value))}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax" className="text-xs">Tax (%)</Label>
                  <Input
                    id="tax"
                    type="number"
                    value={invoiceData.tax}
                    onChange={(e) => updateInvoiceData('tax', Number(e.target.value))}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-xs">Notes</Label>
                <Textarea
                  id="notes"
                  value={invoiceData.notes}
                  onChange={(e) => updateInvoiceData('notes', e.target.value)}
                  placeholder="Payment terms, notes, etc."
                  className="min-h-16 text-sm resize-none"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => onExportPDF(invoiceData)}
              className="flex-1"
            >
              <Download className="h-3 w-3 mr-1" />
              Export PDF
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onPrint(invoiceData)}
              className="flex-1"
            >
              <Printer className="h-3 w-3 mr-1" />
              Print
            </Button>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="flex-1 bg-muted/30 overflow-y-auto">
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <div
              className="invoice-preview bg-white shadow-lg mx-auto"
              style={{
                width: '210mm',
                minHeight: '297mm',
                padding: '20mm',
                fontFamily: layout.theme.accentColor || 'system-ui',
                color: layout.theme.textColor,
              }}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  {companySettings.logo && (
                    <img 
                      src={companySettings.logo} 
                      alt="Company Logo" 
                      className="max-w-32 max-h-20 object-contain mb-4"
                    />
                  )}
                  <div style={{ color: layout.theme.primaryColor }}>
                    <h1 className="text-2xl font-bold">{companySettings.companyName || 'Your Company'}</h1>
                    <div className="text-sm mt-2 whitespace-pre-line">
                      {companySettings.address}
                      {companySettings.phone && <div>Phone: {companySettings.phone}</div>}
                      {companySettings.email && <div>Email: {companySettings.email}</div>}
                      {companySettings.taxId && <div>GST: {companySettings.taxId}</div>}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold mb-4" style={{ color: layout.theme.primaryColor }}>
                    INVOICE
                  </h2>
                  <div className="text-sm space-y-1">
                    <div><strong>Invoice #:</strong> {invoiceData.invoiceNumber}</div>
                    <div><strong>Date:</strong> {format(new Date(invoiceData.date), 'dd/MM/yyyy')}</div>
                    <div><strong>Due Date:</strong> {format(new Date(invoiceData.dueDate), 'dd/MM/yyyy')}</div>
                  </div>
                </div>
              </div>

              {/* Bill To */}
              <div className="mb-8">
                <h3 className="font-semibold mb-2" style={{ color: layout.theme.secondaryColor }}>
                  Bill To:
                </h3>
                <div className="text-sm">
                  {invoiceData.clientName && <div className="font-medium">{invoiceData.clientName}</div>}
                  {invoiceData.clientAddress && <div className="whitespace-pre-line">{invoiceData.clientAddress}</div>}
                  {invoiceData.clientGST && <div>GST: {invoiceData.clientGST}</div>}
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ backgroundColor: layout.theme.primaryColor + '10', borderBottom: `1px solid ${layout.theme.borderColor}` }}>
                      <th className="text-left p-3 font-semibold">Description</th>
                      <th className="text-center p-3 font-semibold w-20">Qty</th>
                      <th className="text-right p-3 font-semibold w-24">Rate</th>
                      <th className="text-right p-3 font-semibold w-24">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.items.map((item) => (
                      <tr key={item.id} style={{ borderBottom: `1px solid ${layout.theme.borderColor}` }}>
                        <td className="p-3">{item.description || 'Item description'}</td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-right">₹{item.rate.toFixed(2)}</td>
                        <td className="p-3 text-right">₹{item.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end mb-8">
                <div className="w-80">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{totals.subtotal.toFixed(2)}</span>
                    </div>
                    {invoiceData.discount > 0 && (
                      <div className="flex justify-between">
                        <span>Discount ({invoiceData.discount}%):</span>
                        <span>-₹{totals.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Tax ({invoiceData.tax}%):</span>
                      <span>₹{totals.taxAmount.toFixed(2)}</span>
                    </div>
                    <div 
                      className="flex justify-between font-bold text-lg pt-2"
                      style={{ borderTop: `1px solid ${layout.theme.borderColor}` }}
                    >
                      <span>Total:</span>
                      <span>₹{totals.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {invoiceData.notes && (
                <div className="mb-8">
                  <h3 className="font-semibold mb-2" style={{ color: layout.theme.secondaryColor }}>
                    Notes:
                  </h3>
                  <div className="text-sm whitespace-pre-line">{invoiceData.notes}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};