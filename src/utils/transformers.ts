import type { Client, Invoice, InvoiceItem } from "@/types";

/**
 * Transform a database client row into the application Client type.
 */
export function mapDbClient(c: Record<string, any>): Client {
  return {
    id: c.id,
    companyName: c.company_name,
    contactName: c.contact_name ?? "",
    gstNumber: c.gst_number ?? "",
    phoneNumber: c.phone_number ?? "",
    phone: c.phone_number ?? "",
    email: c.email ?? "",
    bankAccountNumber: c.bank_account_number ?? "",
    bankDetails: c.bank_details ?? "",
    address: c.address ?? "",
    city: c.city ?? "",
    state: c.state ?? "",
    postalCode: c.postal_code ?? "",
    website: c.website ?? "",
    tags: c.tags ?? [],
    status: c.status as Client["status"],
    lastInvoiceDate: c.last_invoice_date ?? undefined,
    totalInvoiced: c.total_invoiced ?? undefined,
    pendingInvoices: c.pending_invoices ?? undefined,
    fyInvoices: c.fy_invoices ?? undefined,
  };
}

/**
 * Transform a database invoice item row into the application InvoiceItem type.
 */
export function mapDbInvoiceItem(item: Record<string, any>): InvoiceItem {
  return {
    id: item.id,
    description: item.description,
    hsnCode: item.hsn_code ?? "",
    quantity: Number(item.quantity),
    rate: Number(item.rate),
    gstRate: Number(item.gst_rate),
    cgstRate: Number(item.cgst_rate),
    sgstRate: Number(item.sgst_rate),
    amount: Number(item.amount),
  };
}

/**
 * Transform a database invoice row (with nested clients + invoice_items) into the application Invoice type.
 */
export function mapDbInvoice(i: Record<string, any>): Invoice {
  return {
    id: i.id,
    invoiceNumber: i.invoice_number,
    clientId: i.client_id,
    clientName: i.clients?.company_name || "Unknown Client",
    date: i.date,
    dueDate: i.due_date,
    amount: Number(i.total),
    status: i.status,
    subtotal: Number(i.subtotal),
    gstAmount: Number(i.gst_amount),
    total: Number(i.total),
    gstType: i.gst_type,
    notes: i.notes,
    lastStatusUpdate: i.last_status_update,
    items: (i.invoice_items ?? []).map(mapDbInvoiceItem),
  };
}

/**
 * Convert a Client object back to database column names for insert/update.
 */
export function clientToDbFields(client: Omit<Client, "id">) {
  return {
    company_name: client.companyName,
    contact_name: client.contactName,
    gst_number: client.gstNumber,
    phone_number: client.phoneNumber,
    bank_account_number: client.bankAccountNumber,
    bank_details: client.bankDetails,
    address: client.address,
    city: client.city,
    state: client.state,
    postal_code: client.postalCode,
    website: client.website,
    tags: client.tags,
    status: client.status,
    email: client.email,
  };
}
