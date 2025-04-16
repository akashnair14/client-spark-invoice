
export interface Client {
  id: string;
  companyName: string;
  contactName?: string;
  gstNumber: string;
  phoneNumber: string;
  phone?: string;
  email: string;
  bankAccountNumber: string;
  bankDetails: string;
  address: string;
  city?: string;
  state?: string;
  postalCode?: string;
  website?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  hsnCode: string;
  rate: number;
  gstRate: number;
  cgstRate: number;
  sgstRate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  clientId: string;
  date: string;
  dueDate: string;
  invoiceNumber: string;
  items: InvoiceItem[];
  subtotal: number;
  gstAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'pending' | 'overdue';
  notes?: string;
}

export type GstRate = 0 | 5 | 12 | 18 | 28;

export const GST_RATES: GstRate[] = [0, 5, 12, 18, 28];
