import React from "react";
import { TemplateLayout, DataTokens } from "@/types/template";
import { Client, Invoice, InvoiceItem } from "@/types";

interface CustomInvoiceTemplateProps {
  layout: TemplateLayout;
  client: Client;
  invoice: Invoice;
  items: InvoiceItem[];
  isPDF?: boolean;
}

export const CustomInvoiceTemplate = React.forwardRef<HTMLDivElement, CustomInvoiceTemplateProps>(
  ({ layout, client, invoice, items, isPDF = false }, ref) => {
    // Prepare data for template tokens
    const data: DataTokens = {
      company: {
        name: "Your Company Name", // This would come from user settings
        address: "123 Business Street, City, State 12345",
        phone: "+1 (555) 123-4567",
        email: "info@company.com",
        gst: "29ABCDE1234F1Z5",
        logo: "",
      },
      invoice: {
        number: invoice.invoiceNumber,
        date: invoice.date,
        dueDate: invoice.dueDate || invoice.date,
        subtotal: invoice.subtotal,
        gstAmount: invoice.gstAmount,
        total: invoice.total,
        notes: invoice.notes || "",
      },
      client: {
        companyName: client.companyName,
        contactName: client.contactName,
        address: client.address,
        gstNumber: client.gstNumber,
        phone: client.phone || "",
        email: client.email || "",
      },
      items: items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        hsnCode: item.hsnCode,
        gstRate: item.gstRate,
        amount: item.amount,
      })),
    };

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
                <div className="font-bold text-2xl mb-1">
                  {component.data?.title || data.company?.name}
                </div>
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
      <div 
        ref={ref}
        className={`relative bg-white ${isPDF ? 'print-content' : ''}`}
        style={{
          width: '210mm',
          height: '297mm',
          aspectRatio: '210/297',
          minHeight: '600px',
          color: 'black',
        }}
      >
        {/* Render all visible components */}
        {layout.components.map(renderComponent)}
        
        {/* Print styles */}
        {isPDF && (
          <style>
            {`
              .print-content * {
                color: black !important;
                background: transparent !important;
              }
              .print-content .border {
                border-color: black !important;
              }
            `}
          </style>
        )}
      </div>
    );
  }
);

CustomInvoiceTemplate.displayName = "CustomInvoiceTemplate";

export default CustomInvoiceTemplate;