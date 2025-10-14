// Type definitions for .NET Core API

export interface User {
  id: string;
  email: string;
  role?: 'admin' | 'user';
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresAt: string;
}

export interface Client {
  id: string;
  owner_id: string;
  company_name: string;
  contact_name?: string;
  gst_number?: string;
  phone_number?: string;
  email?: string;
  bank_account_number?: string;
  bank_details?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  website?: string;
  tags?: string[];
  status?: string;
  last_invoice_date?: string;
  total_invoiced?: number;
  pending_invoices?: number;
  fy_invoices?: number;
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceItem {
  id?: string;
  invoice_id?: string;
  hsn_code: string;
  description: string;
  quantity: number;
  rate: number;
  gst_rate: number;
  cgst_rate: number;
  sgst_rate: number;
  amount: number;
  sort_order: number;
  created_at?: string;
}

export interface Invoice {
  id: string;
  owner_id: string;
  client_id: string;
  invoice_number: string;
  date: string;
  due_date?: string;
  status: string;
  subtotal: number;
  gst_amount: number;
  total: number;
  gst_type: string;
  notes?: string;
  dc_number?: string;
  challan_number?: string;
  po_number?: string;
  ewb_number?: string;
  challan_date?: string;
  po_date?: string;
  dc_date?: string;
  last_status_update?: string;
  created_at?: string;
  updated_at?: string;
  client?: Client;
  invoice_items?: InvoiceItem[];
}

export interface InvoiceTemplate {
  id: string;
  owner_id: string;
  client_id?: string;
  template_name: string;
  template_type: string;
  layout_data: any;
  is_default: boolean;
  is_active: boolean;
  paper_size: string;
  orientation: string;
  margins: any;
  created_at?: string;
  updated_at?: string;
}

export type CreateClient = Omit<Client, 'id' | 'created_at' | 'updated_at'>;
export type UpdateClient = Partial<CreateClient>;

export type CreateInvoice = Omit<Invoice, 'id' | 'created_at' | 'updated_at' | 'owner_id'>;
export type UpdateInvoice = Partial<CreateInvoice>;

export type CreateInvoiceTemplate = Omit<InvoiceTemplate, 'id' | 'created_at' | 'updated_at' | 'owner_id'>;
export type UpdateInvoiceTemplate = Partial<CreateInvoiceTemplate>;
