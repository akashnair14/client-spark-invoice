
import React from "react";
import { format } from "date-fns";
import { Client, Invoice } from "@/types";

interface InvoiceTemplateClientProps {
  client: Client;
  date: Date;
  dueDate: Date;
  status?: Invoice['status'];
  isPDF?: boolean;
  compact?: boolean;
}

const InvoiceTemplateClient = ({ 
  client, 
  date, 
  dueDate, 
  status = 'draft',
  isPDF = false,
  compact = false
}: InvoiceTemplateClientProps) => {
  const formatDate = (date: Date) => {
    try {
      return format(date, "dd-MMM-yyyy");
    } catch {
      return "Invalid date";
    }
  };

  const fontSize = compact ? '0.7rem' : '0.875rem';
  const headingSize = compact ? '0.8rem' : '1rem';

  if (isPDF) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: compact ? '1rem' : '2rem',
        marginBottom: compact ? '0.75rem' : '2rem',
        padding: compact ? '0.5rem' : '1rem',
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb'
      }}>
        <div>
          <h3 style={{fontSize: headingSize, fontWeight: '600', marginBottom: '0.25rem', color: '#111827'}}>
            Bill To:
          </h3>
          <div style={{borderLeft: '3px solid #3b82f6', paddingLeft: '0.75rem'}}>
            <h4 style={{fontSize: compact ? '0.85rem' : '1.125rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', color: '#111827'}}>
              {client.companyName}
            </h4>
            <p style={{margin: '0', fontSize, color: '#374151'}}>{client.contactName}</p>
            <p style={{margin: '0.125rem 0', fontSize, color: '#374151'}}>{client.address}</p>
            <p style={{margin: '0', fontSize, color: '#374151'}}>{client.city}, {client.state} {client.postalCode}</p>
            <p style={{margin: '0.25rem 0 0 0', fontSize, fontWeight: '600', color: '#111827'}}>GST: {client.gstNumber}</p>
            <p style={{margin: '0.125rem 0 0 0', fontSize, color: '#374151'}}>Email: {client.email}</p>
            <p style={{margin: '0', fontSize, color: '#374151'}}>Phone: {client.phoneNumber}</p>
          </div>
        </div>
        
        <div style={{textAlign: 'right'}}>
          <h3 style={{fontSize: headingSize, fontWeight: '600', marginBottom: '0.25rem', color: '#111827'}}>
            Invoice Details:
          </h3>
          <table style={{width: '100%', fontSize}}>
            <tbody>
              <tr>
                <td style={{padding: '0.125rem 0', color: '#374151', textAlign: 'left'}}>Date:</td>
                <td style={{padding: '0.125rem 0', fontWeight: '600', textAlign: 'right', color: '#111827'}}>{formatDate(date)}</td>
              </tr>
              <tr>
                <td style={{padding: '0.125rem 0', color: '#374151', textAlign: 'left'}}>Due Date:</td>
                <td style={{padding: '0.125rem 0', fontWeight: '600', textAlign: 'right', color: '#111827'}}>{formatDate(dueDate)}</td>
              </tr>
              <tr>
                <td style={{padding: '0.125rem 0', color: '#374151', textAlign: 'left'}}>Status:</td>
                <td style={{padding: '0.125rem 0', fontWeight: '600', textAlign: 'right', textTransform: 'capitalize', color: '#111827'}}>{status}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/30 border rounded-lg ${compact ? 'mb-4 p-3' : 'mb-8 p-4'}`}>
      <div>
        <h3 className={`font-semibold text-foreground ${compact ? 'text-sm mb-1.5' : 'text-base mb-3'}`}>Bill To:</h3>
        <div className="border-l-4 border-primary pl-3">
          <h4 className={`font-bold text-foreground ${compact ? 'text-sm mb-0.5' : 'text-lg mb-1'}`}>{client.companyName}</h4>
          <p className={`text-foreground/80 ${compact ? 'text-xs' : 'text-sm'}`}>{client.contactName}</p>
          <p className={`text-foreground/80 mt-0.5 ${compact ? 'text-xs' : 'text-sm'}`}>{client.address}</p>
          <p className={`text-foreground/80 ${compact ? 'text-xs' : 'text-sm'}`}>
            {client.city}, {client.state} {client.postalCode}
          </p>
          <p className={`font-semibold text-foreground mt-1 ${compact ? 'text-xs' : 'text-sm'}`}>GST: {client.gstNumber}</p>
          <p className={`text-foreground/80 mt-0.5 ${compact ? 'text-xs' : 'text-sm'}`}>Email: {client.email}</p>
          <p className={`text-foreground/80 ${compact ? 'text-xs' : 'text-sm'}`}>Phone: {client.phoneNumber}</p>
        </div>
      </div>
      
      <div className="md:text-right">
        <h3 className={`font-semibold text-foreground ${compact ? 'text-sm mb-1.5' : 'text-base mb-3'}`}>Invoice Details:</h3>
        <div className={compact ? 'space-y-1' : 'space-y-2'}>
          <div className="flex justify-between md:justify-end md:gap-8">
            <span className={`text-foreground/70 ${compact ? 'text-xs' : 'text-sm'}`}>Date:</span>
            <span className={`font-semibold text-foreground ${compact ? 'text-xs' : 'text-sm'}`}>{formatDate(date)}</span>
          </div>
          <div className="flex justify-between md:justify-end md:gap-8">
            <span className={`text-foreground/70 ${compact ? 'text-xs' : 'text-sm'}`}>Due Date:</span>
            <span className={`font-semibold text-foreground ${compact ? 'text-xs' : 'text-sm'}`}>{formatDate(dueDate)}</span>
          </div>
          <div className="flex justify-between md:justify-end md:gap-8">
            <span className={`text-foreground/70 ${compact ? 'text-xs' : 'text-sm'}`}>Status:</span>
            <span className={`font-semibold capitalize text-foreground ${compact ? 'text-xs' : 'text-sm'}`}>{status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplateClient;
