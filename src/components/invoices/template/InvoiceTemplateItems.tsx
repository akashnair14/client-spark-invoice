
import React from "react";
import { InvoiceItem } from "@/types";

interface InvoiceTemplateItemsProps {
  items: InvoiceItem[];
  isPDF?: boolean;
}

const InvoiceTemplateItems = ({ items, isPDF = false }: InvoiceTemplateItemsProps) => {
  // Adaptive sizing based on item count for print
  const itemCount = items.length;
  const getPrintSizing = () => {
    if (itemCount > 20) return { cellPad: '2px 6px', fontSize: '8px', headerSize: '8px' };
    if (itemCount > 12) return { cellPad: '3px 6px', fontSize: '9px', headerSize: '9px' };
    if (itemCount > 8) return { cellPad: '4px 8px', fontSize: '10px', headerSize: '10px' };
    return { cellPad: '6px 10px', fontSize: '11px', headerSize: '10px' };
  };

  if (isPDF) {
    const { cellPad, fontSize, headerSize } = getPrintSizing();
    return (
      <div style={{ marginBottom: '14px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#4f46e5' }}>
              <th style={{ padding: cellPad, textAlign: 'center', fontSize: headerSize, fontWeight: '600', color: 'white', width: '30px' }}>#</th>
              <th style={{ padding: cellPad, textAlign: 'left', fontSize: headerSize, fontWeight: '600', color: 'white' }}>Description</th>
              <th style={{ padding: cellPad, textAlign: 'center', fontSize: headerSize, fontWeight: '600', color: 'white', width: '60px' }}>HSN</th>
              <th style={{ padding: cellPad, textAlign: 'right', fontSize: headerSize, fontWeight: '600', color: 'white', width: '40px' }}>Qty</th>
              <th style={{ padding: cellPad, textAlign: 'right', fontSize: headerSize, fontWeight: '600', color: 'white', width: '70px' }}>Rate</th>
              <th style={{ padding: cellPad, textAlign: 'right', fontSize: headerSize, fontWeight: '600', color: 'white', width: '45px' }}>GST%</th>
              <th style={{ padding: cellPad, textAlign: 'right', fontSize: headerSize, fontWeight: '600', color: 'white', width: '80px' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: cellPad, fontSize, textAlign: 'center', color: '#6b7280' }}>{index + 1}</td>
                <td style={{ padding: cellPad, fontSize, color: '#111827', fontWeight: '500' }}>{item.description}</td>
                <td style={{ padding: cellPad, fontSize, textAlign: 'center', color: '#6b7280' }}>{item.hsnCode}</td>
                <td style={{ padding: cellPad, fontSize, textAlign: 'right', color: '#111827' }}>{item.quantity}</td>
                <td style={{ padding: cellPad, fontSize, textAlign: 'right', color: '#111827' }}>₹{item.rate.toFixed(2)}</td>
                <td style={{ padding: cellPad, fontSize, textAlign: 'right', color: '#6b7280' }}>{item.gstRate}%</td>
                <td style={{ padding: cellPad, fontSize, textAlign: 'right', fontWeight: '600', color: '#111827' }}>₹{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary">
              <th className="py-2.5 px-3 text-left text-[11px] font-semibold text-primary-foreground w-8 text-center">#</th>
              <th className="py-2.5 px-3 text-left text-[11px] font-semibold text-primary-foreground">Description</th>
              <th className="py-2.5 px-3 text-center text-[11px] font-semibold text-primary-foreground w-16">HSN</th>
              <th className="py-2.5 px-3 text-right text-[11px] font-semibold text-primary-foreground w-12">Qty</th>
              <th className="py-2.5 px-3 text-right text-[11px] font-semibold text-primary-foreground w-20">Rate</th>
              <th className="py-2.5 px-3 text-right text-[11px] font-semibold text-primary-foreground w-14">GST%</th>
              <th className="py-2.5 px-3 text-right text-[11px] font-semibold text-primary-foreground w-24">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr 
                key={item.id} 
                className={`border-b border-border/50 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}`}
              >
                <td className="py-2 px-3 text-xs text-foreground/60 text-center">{index + 1}</td>
                <td className="py-2 px-3 text-xs font-medium text-foreground">{item.description}</td>
                <td className="py-2 px-3 text-xs text-center text-foreground/60">{item.hsnCode}</td>
                <td className="py-2 px-3 text-xs text-right text-foreground">{item.quantity}</td>
                <td className="py-2 px-3 text-xs text-right text-foreground">₹{item.rate.toFixed(2)}</td>
                <td className="py-2 px-3 text-xs text-right text-foreground/60">{item.gstRate}%</td>
                <td className="py-2 px-3 text-xs text-right font-semibold text-foreground">₹{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceTemplateItems;
