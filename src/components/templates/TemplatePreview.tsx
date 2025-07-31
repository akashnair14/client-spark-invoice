import { TemplateLayout, DataTokens } from "@/types/template";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, ArrowLeft } from "lucide-react";

interface TemplatePreviewProps {
  layout: TemplateLayout;
  onBack?: () => void;
  data?: Partial<DataTokens>;
}

// Mock data for preview
const mockData: DataTokens = {
  company: {
    name: "Your Company Name",
    address: "123 Business Street, City, State 12345",
    phone: "+1 (555) 123-4567",
    email: "info@company.com",
    gst: "29ABCDE1234F1Z5",
    logo: "",
  },
  invoice: {
    number: "INV-2024-001",
    date: "2024-01-15",
    dueDate: "2024-02-14",
    subtotal: 1000,
    gstAmount: 180,
    total: 1180,
    notes: "Payment due within 30 days. Thank you for your business!",
  },
  client: {
    companyName: "Client Company Ltd",
    contactName: "John Doe",
    address: "456 Client Avenue, Customer City, State 67890",
    gstNumber: "29ZYXWV9876E1A3",
    phone: "+1 (555) 987-6543",
    email: "john@client.com",
  },
  items: [
    {
      description: "Professional Services",
      quantity: 10,
      rate: 100,
      hsnCode: "998361",
      gstRate: 18,
      amount: 1000,
    },
    {
      description: "Consultation Hours",
      quantity: 5,
      rate: 150,
      hsnCode: "998362",
      gstRate: 18,
      amount: 750,
    },
  ],
};

export const TemplatePreview = ({ layout, onBack, data = mockData }: TemplatePreviewProps) => {
  const renderComponent = (component: any) => {
    if (!component.isVisible) return null;

    const style = {
      position: 'absolute' as const,
      left: `${component.position.x}%`,
      top: `${component.position.y}%`,
      width: `${component.size.width}%`,
      height: `${component.size.height}%`,
      fontSize: component.styles.fontSize,
      fontWeight: component.styles.fontWeight,
      fontFamily: component.styles.fontFamily || 'system-ui',
      color: component.styles.color,
      backgroundColor: component.styles.backgroundColor,
      textAlign: component.styles.textAlign,
      padding: '8px',
      overflow: 'hidden',
    };

    const getContent = () => {
      switch (component.type) {
        case 'header':
          return (
            <div className="text-center">
              <div className="font-bold text-2xl mb-1">{data.company?.name}</div>
              <div className="text-lg">INVOICE</div>
            </div>
          );

        case 'invoice-details':
          return (
            <div className="space-y-1 text-sm">
              {component.fields?.includes('invoiceNumber') && (
                <div><strong>Invoice #:</strong> {data.invoice?.number}</div>
              )}
              {component.fields?.includes('date') && (
                <div><strong>Date:</strong> {data.invoice?.date}</div>
              )}
              {component.fields?.includes('dueDate') && (
                <div><strong>Due Date:</strong> {data.invoice?.dueDate}</div>
              )}
            </div>
          );

        case 'client-info':
          return (
            <div className="space-y-1 text-sm">
              <div className="font-semibold">Bill To:</div>
              {component.fields?.includes('companyName') && (
                <div>{data.client?.companyName}</div>
              )}
              {component.fields?.includes('contactName') && (
                <div>{data.client?.contactName}</div>
              )}
              {component.fields?.includes('address') && (
                <div>{data.client?.address}</div>
              )}
              {component.fields?.includes('gstNumber') && (
                <div><strong>GST:</strong> {data.client?.gstNumber}</div>
              )}
            </div>
          );

        case 'items-table':
          return (
            <div className="text-xs">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    {component.columns?.includes('description') && <th className="text-left p-1">Description</th>}
                    {component.columns?.includes('quantity') && <th className="text-center p-1">Qty</th>}
                    {component.columns?.includes('rate') && <th className="text-right p-1">Rate</th>}
                    {component.columns?.includes('gstRate') && <th className="text-center p-1">GST%</th>}
                    {component.columns?.includes('amount') && <th className="text-right p-1">Amount</th>}
                  </tr>
                </thead>
                <tbody>
                  {data.items?.map((item, index) => (
                    <tr key={index} className="border-b">
                      {component.columns?.includes('description') && (
                        <td className="p-1">{item.description}</td>
                      )}
                      {component.columns?.includes('quantity') && (
                        <td className="text-center p-1">{item.quantity}</td>
                      )}
                      {component.columns?.includes('rate') && (
                        <td className="text-right p-1">₹{item.rate}</td>
                      )}
                      {component.columns?.includes('gstRate') && (
                        <td className="text-center p-1">{item.gstRate}%</td>
                      )}
                      {component.columns?.includes('amount') && (
                        <td className="text-right p-1">₹{item.amount}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );

        case 'totals':
          return (
            <div className="space-y-1 text-sm text-right">
              {component.fields?.includes('subtotal') && (
                <div><strong>Subtotal:</strong> ₹{data.invoice?.subtotal}</div>
              )}
              {component.fields?.includes('gstAmount') && (
                <div><strong>GST:</strong> ₹{data.invoice?.gstAmount}</div>
              )}
              {component.fields?.includes('total') && (
                <div className="text-lg font-bold border-t pt-1">
                  <strong>Total:</strong> ₹{data.invoice?.total}
                </div>
              )}
            </div>
          );

        case 'notes':
          return (
            <div className="text-xs">
              <div className="font-semibold mb-1">Terms & Conditions:</div>
              <div>{data.invoice?.notes}</div>
            </div>
          );

        case 'logo':
          return (
            <div className="border-2 border-dashed border-gray-300 h-full flex items-center justify-center text-gray-500">
              LOGO
            </div>
          );

        case 'signature':
          return (
            <div className="border-t border-gray-300 pt-2 text-center text-xs">
              Authorized Signature
            </div>
          );

        case 'qr-code':
          return (
            <div className="border-2 border-gray-300 h-full flex items-center justify-center text-xs">
              [QR CODE]
            </div>
          );

        default:
          return <div>Unknown component</div>;
      }
    };

    return (
      <div key={component.id} style={style}>
        {getContent()}
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-muted/30">
      {/* Header */}
      <div className="border-b bg-background p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Editor
              </Button>
            )}
            <h1 className="text-xl font-semibold">Invoice Preview</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto">
          {/* A4 Preview */}
          <Card className="relative bg-white shadow-lg mx-auto" style={{
            width: '210mm',
            height: '297mm',
            maxWidth: '100%',
            aspectRatio: '210/297',
            minHeight: '600px',
          }}>
            {layout.components.map(renderComponent)}
          </Card>

          {/* Preview Info */}
          <div className="mt-4 text-center text-xs text-muted-foreground">
            <div>
              Paper Size: A4 (210mm × 297mm) • 
              Components: {layout.components.filter(c => c.isVisible).length} visible •
              Preview Mode
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};