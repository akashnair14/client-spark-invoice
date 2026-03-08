
import React from "react";
import { format } from "date-fns";
import { Client, Invoice } from "@/types";

interface InvoiceTemplateClientProps {
  client: Client;
  date: Date;
  dueDate: Date;
  status?: Invoice['status'];
  isPDF?: boolean;
}

const InvoiceTemplateClient = ({ 
  client, 
  date, 
  dueDate, 
  status = 'draft',
  isPDF = false
}: InvoiceTemplateClientProps) => {
  const formatDate = (date: Date) => {
    try {
      return format(date, "dd MMM yyyy");
    } catch {
      return "Invalid date";
    }
  };

  if (isPDF) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '16px',
        gap: '24px',
      }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px', color: '#9ca3af', fontWeight: '600', margin: '0 0 4px 0' }}>
            Bill To
          </p>
          <h4 style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 4px 0', color: '#111827' }}>
            {client.companyName}
          </h4>
          <div style={{ fontSize: '11px', color: '#374151', lineHeight: '1.5' }}>
            {client.contactName && <p style={{ margin: '0' }}>{client.contactName}</p>}
            <p style={{ margin: '0' }}>{client.address}</p>
            <p style={{ margin: '0' }}>{client.city}, {client.state} - {client.postalCode}</p>
            {client.gstNumber && (
              <p style={{ margin: '4px 0 0 0', fontWeight: '600', color: '#111827' }}>GSTIN: {client.gstNumber}</p>
            )}
          </div>
        </div>
        
        <div style={{ textAlign: 'right', minWidth: '140px' }}>
          <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '1px', color: '#9ca3af', fontWeight: '600', margin: '0 0 6px 0' }}>
            Invoice Details
          </p>
          <table style={{ fontSize: '11px', marginLeft: 'auto' }}>
            <tbody>
              <tr>
                <td style={{ padding: '2px 12px 2px 0', color: '#6b7280' }}>Date</td>
                <td style={{ padding: '2px 0', fontWeight: '600', color: '#111827' }}>{formatDate(date)}</td>
              </tr>
              <tr>
                <td style={{ padding: '2px 12px 2px 0', color: '#6b7280' }}>Due Date</td>
                <td style={{ padding: '2px 0', fontWeight: '600', color: '#111827' }}>{formatDate(dueDate)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-foreground/50 font-semibold mb-1">Bill To</p>
        <h4 className="text-base font-bold text-foreground mb-1">{client.companyName}</h4>
        <div className="text-xs text-foreground/70 leading-relaxed space-y-0.5">
          {client.contactName && <p>{client.contactName}</p>}
          <p>{client.address}</p>
          <p>{client.city}, {client.state} - {client.postalCode}</p>
          {client.gstNumber && (
            <p className="font-semibold text-foreground mt-1">GSTIN: {client.gstNumber}</p>
          )}
        </div>
      </div>
      
      <div className="md:text-right">
        <p className="text-[10px] uppercase tracking-widest text-foreground/50 font-semibold mb-1.5">Invoice Details</p>
        <div className="space-y-1">
          <div className="flex justify-between md:justify-end md:gap-6">
            <span className="text-xs text-foreground/60">Date</span>
            <span className="text-xs font-semibold text-foreground">{formatDate(date)}</span>
          </div>
          <div className="flex justify-between md:justify-end md:gap-6">
            <span className="text-xs text-foreground/60">Due Date</span>
            <span className="text-xs font-semibold text-foreground">{formatDate(dueDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplateClient;
