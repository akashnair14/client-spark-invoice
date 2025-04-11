
import React from "react";

interface InvoiceNotesProps {
  notes?: string;
  isPDF?: boolean;
}

const InvoiceNotes = ({ notes, isPDF = false }: InvoiceNotesProps) => {
  if (!notes) return null;

  if (isPDF) {
    return (
      <div style={{borderTop: '1px solid #e5e7eb', paddingTop: '1rem'}}>
        <h4 style={{fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem'}}>Notes:</h4>
        <p style={{fontSize: '0.875rem', color: '#6b7280'}}>{notes}</p>
      </div>
    );
  }

  return (
    <div className="border-t border-border pt-4">
      <h4 className="text-sm font-medium mb-2">Notes:</h4>
      <p className="text-sm text-muted-foreground">{notes}</p>
    </div>
  );
};

export default InvoiceNotes;
