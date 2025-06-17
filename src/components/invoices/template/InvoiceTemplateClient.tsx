
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
      return format(date, "dd-MMM-yyyy");
    } catch {
      return "Invalid date";
    }
  };

  if (isPDF) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: '#f9fafb',
        border: '1px solid #e5e7eb'
      }}>
        <div>
          <h3 style={{fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151'}}>
            Bill To:
          </h3>
          <div style={{borderLeft: '3px solid #3b82f6', paddingLeft: '1rem'}}>
            <h4 style={{fontSize: '1.125rem', fontWeight: 'bold', margin: '0 0 0.5rem 0'}}>
              {client.companyName}
            </h4>
            <p style={{margin: '0', fontSize: '0.875rem', color: '#6b7280'}}>
              {client.contactName}
            </p>
            <p style={{margin: '0.25rem 0', fontSize: '0.875rem', color: '#6b7280'}}>
              {client.address}
            </p>
            <p style={{margin: '0', fontSize: '0.875rem', color: '#6b7280'}}>
              {client.city}, {client.state} {client.postalCode}
            </p>
            <p style={{margin: '0.5rem 0 0 0', fontSize: '0.875rem', fontWeight: '500'}}>
              GST: {client.gstNumber}
            </p>
            <p style={{margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#6b7280'}}>
              Email: {client.email}
            </p>
            <p style={{margin: '0', fontSize: '0.875rem', color: '#6b7280'}}>
              Phone: {client.phoneNumber}
            </p>
          </div>
        </div>
        
        <div style={{textAlign: 'right'}}>
          <div style={{marginBottom: '1rem'}}>
            <h3 style={{fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151'}}>
              Invoice Details:
            </h3>
            <table style={{width: '100%', fontSize: '0.875rem'}}>
              <tbody>
                <tr>
                  <td style={{padding: '0.25rem 0', color: '#6b7280', textAlign: 'left'}}>Date:</td>
                  <td style={{padding: '0.25rem 0', fontWeight: '500', textAlign: 'right'}}>{formatDate(date)}</td>
                </tr>
                <tr>
                  <td style={{padding: '0.25rem 0', color: '#6b7280', textAlign: 'left'}}>Due Date:</td>
                  <td style={{padding: '0.25rem 0', fontWeight: '500', textAlign: 'right'}}>{formatDate(dueDate)}</td>
                </tr>
                <tr>
                  <td style={{padding: '0.25rem 0', color: '#6b7280', textAlign: 'left'}}>Status:</td>
                  <td style={{padding: '0.25rem 0', fontWeight: '500', textAlign: 'right', textTransform: 'capitalize'}}>{status}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 p-4 bg-muted/30 border rounded-lg">
      <div>
        <h3 className="text-base font-semibold mb-3 text-foreground">Bill To:</h3>
        <div className="border-l-4 border-primary pl-4">
          <h4 className="text-lg font-bold mb-1">{client.companyName}</h4>
          <p className="text-sm text-muted-foreground">{client.contactName}</p>
          <p className="text-sm text-muted-foreground mt-1">{client.address}</p>
          <p className="text-sm text-muted-foreground">
            {client.city}, {client.state} {client.postalCode}
          </p>
          <p className="text-sm font-medium mt-2">GST: {client.gstNumber}</p>
          <p className="text-sm text-muted-foreground mt-1">Email: {client.email}</p>
          <p className="text-sm text-muted-foreground">Phone: {client.phoneNumber}</p>
        </div>
      </div>
      
      <div className="md:text-right">
        <h3 className="text-base font-semibold mb-3 text-foreground">Invoice Details:</h3>
        <div className="space-y-2">
          <div className="flex justify-between md:justify-end md:gap-8">
            <span className="text-sm text-muted-foreground">Date:</span>
            <span className="text-sm font-medium">{formatDate(date)}</span>
          </div>
          <div className="flex justify-between md:justify-end md:gap-8">
            <span className="text-sm text-muted-foreground">Due Date:</span>
            <span className="text-sm font-medium">{formatDate(dueDate)}</span>
          </div>
          <div className="flex justify-between md:justify-end md:gap-8">
            <span className="text-sm text-muted-foreground">Status:</span>
            <span className="text-sm font-medium capitalize">{status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplateClient;
