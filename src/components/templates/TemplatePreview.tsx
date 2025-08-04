
import { TemplateLayout, DataTokens } from "@/types/template";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, ArrowLeft, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
      border: '1px solid #e5e7eb',
      borderRadius: '4px',
    };

    const getContent = () => {
      switch (component.type) {
        case 'header':
          return (
            <div className="text-center">
              <div className="font-bold text-2xl mb-1">{data.company?.name}</div>
              <div className="text-lg text-primary">INVOICE</div>
            </div>
          );

        case 'invoice-details':
          return (
            <div className="space-y-2 text-sm">
              <div className="font-semibold text-primary mb-2">Invoice Details</div>
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
            <div className="space-y-2 text-sm">
              <div className="font-semibold text-primary mb-2">Bill To:</div>
              {component.fields?.includes('companyName') && (
                <div className="font-medium">{data.client?.companyName}</div>
              )}
              {component.fields?.includes('contactName') && (
                <div>{data.client?.contactName}</div>
              )}
              {component.fields?.includes('address') && (
                <div className="text-muted-foreground">{data.client?.address}</div>
              )}
              {component.fields?.includes('gstNumber') && (
                <div><strong>GST:</strong> {data.client?.gstNumber}</div>
              )}
            </div>
          );

        case 'items-table':
          return (
            <div className="text-xs">
              <div className="font-semibold text-primary mb-2">Items</div>
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    {component.columns?.includes('description') && <th className="text-left p-2 border border-gray-200">Description</th>}
                    {component.columns?.includes('quantity') && <th className="text-center p-2 border border-gray-200">Qty</th>}
                    {component.columns?.includes('rate') && <th className="text-right p-2 border border-gray-200">Rate</th>}
                    {component.columns?.includes('gstRate') && <th className="text-center p-2 border border-gray-200">GST%</th>}
                    {component.columns?.includes('amount') && <th className="text-right p-2 border border-gray-200">Amount</th>}
                  </tr>
                </thead>
                <tbody>
                  {data.items?.slice(0, 2).map((item, index) => (
                    <tr key={index}>
                      {component.columns?.includes('description') && (
                        <td className="p-2 border border-gray-200">{item.description}</td>
                      )}
                      {component.columns?.includes('quantity') && (
                        <td className="text-center p-2 border border-gray-200">{item.quantity}</td>
                      )}
                      {component.columns?.includes('rate') && (
                        <td className="text-right p-2 border border-gray-200">₹{item.rate}</td>
                      )}
                      {component.columns?.includes('gstRate') && (
                        <td className="text-center p-2 border border-gray-200">{item.gstRate}%</td>
                      )}
                      {component.columns?.includes('amount') && (
                        <td className="text-right p-2 border border-gray-200">₹{item.amount}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );

        case 'totals':
          return (
            <div className="space-y-2 text-sm">
              <div className="font-semibold text-primary mb-2">Totals</div>
              {component.fields?.includes('subtotal') && (
                <div className="flex justify-between"><span>Subtotal:</span> <span>₹{data.invoice?.subtotal}</span></div>
              )}
              {component.fields?.includes('gstAmount') && (
                <div className="flex justify-between"><span>GST:</span> <span>₹{data.invoice?.gstAmount}</span></div>
              )}
              {component.fields?.includes('total') && (
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span> <span>₹{data.invoice?.total}</span>
                </div>
              )}
            </div>
          );

        case 'notes':
          return (
            <div className="text-xs">
              <div className="font-semibold text-primary mb-2">Terms & Conditions:</div>
              <div className="text-muted-foreground">{data.invoice?.notes}</div>
            </div>
          );

        case 'logo':
          return (
            <div className="border-2 border-dashed border-gray-300 h-full flex items-center justify-center text-gray-500 bg-gray-50">
              <div className="text-center">
                <div className="text-sm font-medium">COMPANY</div>
                <div className="text-xs">LOGO</div>
              </div>
            </div>
          );

        case 'signature':
          return (
            <div className="border-t border-gray-300 pt-2 text-center text-xs">
              <div className="mb-8"></div>
              <div>Authorized Signature</div>
            </div>
          );

        case 'qr-code':
          return (
            <div className="border-2 border-gray-300 h-full flex items-center justify-center text-xs bg-gray-50">
              <div className="text-center">
                <div className="w-16 h-16 border-2 border-dashed border-gray-400 mx-auto mb-1"></div>
                <div>QR CODE</div>
              </div>
            </div>
          );

        default:
          return <div className="text-xs text-muted-foreground">Unknown component: {component.type}</div>;
      }
    };

    return (
      <div key={component.id} style={style} className="shadow-sm">
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
                Back to Designer
              </Button>
            )}
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold">Template Preview</h1>
              <Badge variant="outline" className="ml-2">
                {layout.components.filter(c => c.isVisible).length} components
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print Preview
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Template
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto">
          {/* Preview Instructions */}
          <div className="mb-6 text-center">
            <h2 className="text-lg font-medium mb-2">Preview Your Invoice Template</h2>
            <p className="text-sm text-muted-foreground">
              This is how your template will look with sample invoice data. 
              Each component is outlined to show its position and size.
            </p>
          </div>

          {/* A4 Preview */}
          <Card className="relative bg-white shadow-xl mx-auto border-2" style={{
            width: '210mm',
            height: '297mm',
            maxWidth: '100%',
            aspectRatio: '210/297',
            minHeight: '600px',
          }}>
            <div className="absolute inset-0 p-4">
              {layout.components.length > 0 ? (
                layout.components.map(renderComponent)
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <div className="text-lg font-medium mb-2">No Components to Preview</div>
                    <div className="text-sm">Add components to your template to see the preview</div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Preview Info */}
          <div className="mt-6 text-center space-y-2">
            <div className="text-xs text-muted-foreground">
              Paper Size: A4 (210mm × 297mm) • 
              Components: {layout.components.filter(c => c.isVisible).length} visible • 
              Total Components: {layout.components.length}
            </div>
            <div className="text-xs text-muted-foreground">
              This preview uses sample data. Your actual invoices will display real client and invoice information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
