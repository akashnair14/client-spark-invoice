
import React from "react";
import { InvoiceItem } from "@/types";

interface InvoiceTemplateItemsProps {
  items: InvoiceItem[];
  isPDF?: boolean;
  compact?: boolean;
  veryCompact?: boolean;
}

const InvoiceTemplateItems = ({ items, isPDF = false, compact = false, veryCompact = false }: InvoiceTemplateItemsProps) => {
  const cellPadding = veryCompact ? '0.25rem 0.4rem' : compact ? '0.35rem 0.5rem' : '0.75rem';
  const fontSize = veryCompact ? '0.65rem' : compact ? '0.75rem' : '0.875rem';
  const headerFontSize = veryCompact ? '0.65rem' : compact ? '0.7rem' : '0.875rem';

  if (isPDF) {
    return (
      <div style={{marginBottom: compact ? '0.75rem' : '2rem'}}>
        <h3 style={{fontSize: compact ? '0.85rem' : '1.125rem', fontWeight: '600', marginBottom: compact ? '0.35rem' : '1rem', color: '#111827'}}>
          Items & Services
        </h3>
        <table style={{width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb'}}>
          <thead>
            <tr style={{backgroundColor: '#f3f4f6'}}>
              <th style={{padding: cellPadding, textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontSize: headerFontSize, fontWeight: '700', color: '#111827'}}>#</th>
              <th style={{padding: cellPadding, textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontSize: headerFontSize, fontWeight: '700', color: '#111827'}}>Description</th>
              <th style={{padding: cellPadding, textAlign: 'center', borderBottom: '1px solid #e5e7eb', fontSize: headerFontSize, fontWeight: '700', color: '#111827'}}>HSN</th>
              <th style={{padding: cellPadding, textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontSize: headerFontSize, fontWeight: '700', color: '#111827'}}>Qty</th>
              <th style={{padding: cellPadding, textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontSize: headerFontSize, fontWeight: '700', color: '#111827'}}>Rate</th>
              <th style={{padding: cellPadding, textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontSize: headerFontSize, fontWeight: '700', color: '#111827'}}>GST%</th>
              <th style={{padding: cellPadding, textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontSize: headerFontSize, fontWeight: '700', color: '#111827'}}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} style={{borderBottom: index < items.length - 1 ? '1px solid #e5e7eb' : 'none'}}>
                <td style={{padding: cellPadding, fontSize, color: '#111827'}}>{index + 1}</td>
                <td style={{padding: cellPadding, fontSize, color: '#111827', fontWeight: '500'}}>{item.description}</td>
                <td style={{padding: cellPadding, fontSize, textAlign: 'center', color: '#374151'}}>{item.hsnCode}</td>
                <td style={{padding: cellPadding, fontSize, textAlign: 'right', color: '#111827'}}>{item.quantity}</td>
                <td style={{padding: cellPadding, fontSize, textAlign: 'right', color: '#111827'}}>₹{item.rate.toFixed(2)}</td>
                <td style={{padding: cellPadding, fontSize, textAlign: 'right', color: '#374151'}}>{item.gstRate}%</td>
                <td style={{padding: cellPadding, fontSize, textAlign: 'right', fontWeight: '600', color: '#111827'}}>₹{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={compact ? 'mb-4' : 'mb-8'}>
      <h3 className={`font-semibold text-foreground ${compact ? 'text-sm mb-2' : 'text-lg mb-4'}`}>Items & Services</h3>
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-muted">
            <tr>
              <th className={`text-left font-bold text-foreground ${compact ? 'py-1.5 px-2 text-xs' : 'py-3 px-4 text-sm'}`}>#</th>
              <th className={`text-left font-bold text-foreground ${compact ? 'py-1.5 px-2 text-xs' : 'py-3 px-4 text-sm'}`}>Description</th>
              <th className={`text-center font-bold text-foreground ${compact ? 'py-1.5 px-2 text-xs' : 'py-3 px-4 text-sm'}`}>HSN</th>
              <th className={`text-right font-bold text-foreground ${compact ? 'py-1.5 px-2 text-xs' : 'py-3 px-4 text-sm'}`}>Qty</th>
              <th className={`text-right font-bold text-foreground ${compact ? 'py-1.5 px-2 text-xs' : 'py-3 px-4 text-sm'}`}>Rate</th>
              <th className={`text-right font-bold text-foreground ${compact ? 'py-1.5 px-2 text-xs' : 'py-3 px-4 text-sm'}`}>GST%</th>
              <th className={`text-right font-bold text-foreground ${compact ? 'py-1.5 px-2 text-xs' : 'py-3 px-4 text-sm'}`}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className="border-b border-border hover:bg-muted/50">
                <td className={`text-foreground ${compact ? 'py-1 px-2 text-xs' : 'py-3 px-4 text-sm'}`}>{index + 1}</td>
                <td className={`font-medium text-foreground ${compact ? 'py-1 px-2 text-xs' : 'py-3 px-4 text-sm'}`}>{item.description}</td>
                <td className={`text-center text-foreground/80 ${compact ? 'py-1 px-2 text-xs' : 'py-3 px-4 text-sm'}`}>{item.hsnCode}</td>
                <td className={`text-right text-foreground ${compact ? 'py-1 px-2 text-xs' : 'py-3 px-4 text-sm'}`}>{item.quantity}</td>
                <td className={`text-right text-foreground ${compact ? 'py-1 px-2 text-xs' : 'py-3 px-4 text-sm'}`}>₹{item.rate.toFixed(2)}</td>
                <td className={`text-right text-foreground/80 ${compact ? 'py-1 px-2 text-xs' : 'py-3 px-4 text-sm'}`}>{item.gstRate}%</td>
                <td className={`text-right font-semibold text-foreground ${compact ? 'py-1 px-2 text-xs' : 'py-3 px-4 text-sm'}`}>₹{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceTemplateItems;
