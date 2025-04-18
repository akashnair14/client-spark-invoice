
import React from "react";
import { InvoiceItem } from "@/types";

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
  isPDF?: boolean;
}

const InvoiceItemsTable = ({ items, isPDF = false }: InvoiceItemsTableProps) => {
  if (isPDF) {
    return (
      <div className="overflow-x-auto mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr style={{backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb'}}>
              <th style={{padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600}}>#</th>
              <th style={{padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600}}>Description</th>
              <th style={{padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600}}>HSN</th>
              <th style={{padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 600}}>Qty</th>
              <th style={{padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 600}}>Rate</th>
              <th style={{padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 600}}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} style={{borderBottom: '1px solid #e5e7eb'}}>
                <td style={{padding: '0.75rem 1rem'}}>{index + 1}</td>
                <td style={{padding: '0.75rem 1rem'}}>{item.description}</td>
                <td style={{padding: '0.75rem 1rem'}}>{item.hsnCode}</td>
                <td style={{padding: '0.75rem 1rem', textAlign: 'right'}}>{item.quantity}</td>
                <td style={{padding: '0.75rem 1rem', textAlign: 'right'}}>₹{item.rate.toFixed(2)}</td>
                <td style={{padding: '0.75rem 1rem', textAlign: 'right'}}>₹{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto mb-8">
      <table className="w-full border-collapse invoice-table">
        <thead>
          <tr className="bg-muted border-b border-border">
            <th className="py-3 px-4 text-left font-medium">#</th>
            <th className="py-3 px-4 text-left font-medium">Description</th>
            <th className="py-3 px-4 text-left font-medium">HSN</th>
            <th className="py-3 px-4 text-right font-medium">Qty</th>
            <th className="py-3 px-4 text-right font-medium">Rate</th>
            <th className="py-3 px-4 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id} className="border-b border-border">
              <td className="py-3 px-4 text-sm">{index + 1}</td>
              <td className="py-3 px-4 text-sm">{item.description}</td>
              <td className="py-3 px-4 text-sm">{item.hsnCode}</td>
              <td className="py-3 px-4 text-sm text-right">{item.quantity}</td>
              <td className="py-3 px-4 text-sm text-right">₹{item.rate.toFixed(2)}</td>
              <td className="py-3 px-4 text-sm text-right">₹{item.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceItemsTable;
