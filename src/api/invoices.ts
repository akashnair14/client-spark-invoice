import { apiRequest } from "@/config/api";
import type { Invoice, InvoiceItem, CreateInvoice, UpdateInvoice } from "@/types/api";
import { isValidUUID } from "@/utils/authUtils";

/**
 * CRUD operations on "invoices" and "invoice_items"
 */

export async function getInvoices(): Promise<Invoice[]> {
  return apiRequest('/invoices', {
    method: 'GET',
  });
}

export async function getInvoice(id: string): Promise<Invoice> {
  if (!isValidUUID(id)) {
    throw new Error("Invalid invoice ID format");
  }
  
  return apiRequest(`/invoices/${id}`, {
    method: 'GET',
  });
}

export async function createInvoice(
  invoice: CreateInvoice,
  items: Omit<InvoiceItem, "invoice_id" | "id">[]
): Promise<Invoice> {
  // Validation
  if (!invoice.invoice_number?.trim()) {
    throw new Error("Invoice number is required");
  }
  
  if (!invoice.client_id) {
    throw new Error("Client is required");
  }
  
  if (!isValidUUID(invoice.client_id)) {
    throw new Error("Invalid client ID format");
  }
  
  if (!items || items.length === 0) {
    throw new Error("At least one invoice item is required");
  }

  return apiRequest('/invoices', {
    method: 'POST',
    body: JSON.stringify({ invoice, items }),
  });
}

export async function updateInvoice(
  id: string,
  updates: UpdateInvoice,
  items?: Omit<InvoiceItem, "invoice_id" | "id">[]
): Promise<Invoice> {
  if (!id) {
    throw new Error("Invoice ID is required");
  }
  
  if (!isValidUUID(id)) {
    throw new Error("Invalid invoice ID format");
  }

  return apiRequest(`/invoices/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ invoice: updates, items }),
  });
}

export async function deleteInvoice(id: string): Promise<boolean> {
  if (!id) {
    throw new Error("Invoice ID is required");
  }
  
  if (!isValidUUID(id)) {
    throw new Error("Invalid invoice ID format");
  }

  await apiRequest(`/invoices/${id}`, {
    method: 'DELETE',
  });
  
  return true;
}

export async function updateInvoiceStatus(id: string, status: string): Promise<Invoice> {
  if (!id) {
    throw new Error("Invoice ID is required");
  }
  
  if (!isValidUUID(id)) {
    throw new Error("Invalid invoice ID format");
  }
  
  const allowedStatuses = ['draft', 'sent', 'paid', 'overdue', 'cancelled'];
  if (!allowedStatuses.includes(status)) {
    throw new Error(`Invalid status. Must be one of: ${allowedStatuses.join(', ')}`);
  }

  return apiRequest(`/invoices/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
