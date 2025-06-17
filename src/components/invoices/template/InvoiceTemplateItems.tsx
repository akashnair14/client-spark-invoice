
import React from "react";
import { InvoiceItem } from "@/types";

interface InvoiceTemplateItemsProps {
  items: InvoiceItem[];
  isPDF?: boolean;
}

const InvoiceTemplateItems = ({ items, isPDF = false }: InvoiceTemplateItemsProps) => {
  if (isPDF) {
    return (
      <div style={{marginBottom: '2rem'}}>
        <h3 style={{fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#374151'}}>
          Items & Services
        </h3>
        <table style={{width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb'}}>
          <thead>
            <tr style={{backgroundColor: '#f3f4f6'}}>
              <th style={{padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem', fontWeight: '600'}}>#</th>
              <th style={{padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem', fontWeight: '600'}}>Description</th>
              <th style={{padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem', fontWeight: '600'}}>HSN</th>
              <th style={{padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem', fontWeight: '600'}}>Qty</th>
              <th style={{padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem', fontWeight: '600'}}>Rate</th>
              <th style={{padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem', fontWeight: '600'}}>GST%</th>
              <th style={{padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem', fontWeight: '600'}}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} style={{borderBottom: index < items.length - 1 ? '1px solid #e5e7eb' : 'none'}}>
                <td style={{padding: '0.75rem', fontSize: '0.875rem'}}>{index + 1}</td>
                <td style={{padding: '0.75rem', fontSize: '0.875rem'}}>{item.description}</td>
                <td style={{padding: '0.75rem', fontSize: '0.875rem', textAlign: 'center'}}>{item.hsnCode}</td>
                <td style={{padding: '0.75rem', fontSize: '0.875rem', textAlign: 'right'}}>{item.quantity}</td>
                <td style={{padding: '0.75rem', fontSize: '0.875rem', textAlign: 'right'}}>₹{item.rate.toFixed(2)}</td>
                <td style={{padding: '0.75rem', fontSize: '0.875rem', textAlign: 'right'}}>{item.gstRate}%</td>
                <td style={{padding: '0.75rem', fontSize: '0.875rem', textAlign: 'right', fontWeight: '500'}}>₹{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Items & Services</h3>
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-muted">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold">#</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">Description</th>
              <th className="py-3 px-4 text-center text-sm font-semibold">HSN</th>
              <th className="py-3 px-4 text-right text-sm font-semibold">Qty</th>
              <th className="py-3 px-4 text-right text-sm font-semibold">Rate</th>
              <th className="py-3 px-4 text-right text-sm font-semibold">GST%</th>
              <th className="py-3 px-4 text-right text-sm font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className="border-b border-border hover:bg-muted/50">
                <td className="py-3 px-4 text-sm">{index + 1}</td>
                <td className="py-3 px-4 text-sm">{item.description}</td>
                <td className="py-3 px-4 text-sm text-center">{item.hsnCode}</td>
                <td className="py-3 px-4 text-sm text-right">{item.quantity}</td>
                <td className="py-3 px-4 text-sm text-right">₹{item.rate.toFixed(2)}</td>
                <td className="py-3 px-4 text-sm text-right">{item.gstRate}%</td>
                <td className="py-3 px-4 text-sm text-right font-medium">₹{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceTemplateItems;
