import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { isValidUUID, getCurrentUserId } from "@/utils/authUtils";

/**
 * CRUD operations on "invoices" and "invoice_items" tables
 */

export async function getInvoices() {
  const { data, error } = await supabase
    .from("invoices")
    .select(`
      *,
      clients!inner(
        id, company_name, contact_name, email, gst_number, address, city, state
      ),
      invoice_items(*)
    `)
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getInvoice(id: string) {
  if (!isValidUUID(id)) {
    throw new Error("Invalid invoice ID format");
  }
  
  const { data, error } = await supabase
    .from("invoices")
    .select(`
      *,
      clients!inner(*),
      invoice_items(*)
    `)
    .eq("id", id)
    .maybeSingle();
  
  if (error) throw error;
  if (!data) throw new Error("Invoice not found");
  return data;
}

export async function createInvoice(
  invoice: Omit<Database["public"]["Tables"]["invoices"]["Insert"], "owner_id">,
  items: Omit<Database["public"]["Tables"]["invoice_items"]["Insert"], "invoice_id">[]
) {
  // Validation
  if (!invoice.invoice_number?.trim()) {
    throw new Error("Invoice number is required");
  }
  
  if (!invoice.client_id) {
    throw new Error("Client ID is required");
  }
  
  if (!isValidUUID(invoice.client_id)) {
    throw new Error("Invalid client ID format");
  }
  
  if (!items || items.length === 0) {
    throw new Error("At least one invoice item is required");
  }

  const userId = await getCurrentUserId();
  
  // Start transaction
  const { data: invoiceData, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      ...invoice,
      owner_id: userId
    })
    .select()
    .single();
  
  if (invoiceError) {
    if (invoiceError.code === '23505') {
      throw new Error("An invoice with this number already exists");
    }
    throw new Error(`Failed to create invoice: ${invoiceError.message}`);
  }
  
  // Insert invoice items
  const itemsToInsert = items.map((item, index) => ({
    ...item,
    invoice_id: invoiceData.id,
    sort_order: index
  }));
  
  const { error: itemsError } = await supabase
    .from("invoice_items")
    .insert(itemsToInsert);
  
  if (itemsError) {
    // Cleanup: delete the invoice if items failed to insert
    await supabase.from("invoices").delete().eq("id", invoiceData.id);
    throw new Error(`Failed to create invoice items: ${itemsError.message}`);
  }
  
  return invoiceData;
}

export async function updateInvoice(
  id: string,
  updates: Partial<Database["public"]["Tables"]["invoices"]["Update"]>,
  items?: Omit<Database["public"]["Tables"]["invoice_items"]["Insert"], "invoice_id">[]
) {
  if (!id) {
    throw new Error("Invoice ID is required");
  }
  
  if (!isValidUUID(id)) {
    throw new Error("Invalid invoice ID format");
  }
  
  // Update invoice
  const { data, error } = await supabase
    .from("invoices")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  
  if (error) {
    if (error.code === '23505') {
      throw new Error("An invoice with this number already exists");
    }
    throw new Error(`Failed to update invoice: ${error.message}`);
  }
  
  // Update items if provided
  if (items) {
    // Delete existing items
    await supabase.from("invoice_items").delete().eq("invoice_id", id);
    
    // Insert new items
    const itemsToInsert = items.map((item, index) => ({
      ...item,
      invoice_id: id,
      sort_order: index
    }));
    
    const { error: itemsError } = await supabase
      .from("invoice_items")
      .insert(itemsToInsert);
    
    if (itemsError) {
      throw new Error(`Failed to update invoice items: ${itemsError.message}`);
    }
  }
  
  return data;
}

export async function deleteInvoice(id: string) {
  if (!id) {
    throw new Error("Invoice ID is required");
  }
  
  if (!isValidUUID(id)) {
    throw new Error("Invalid invoice ID format");
  }

  const { error } = await supabase.from("invoices").delete().eq("id", id);
  if (error) {
    throw new Error(`Failed to delete invoice: ${error.message}`);
  }
  return true;
}

export async function updateInvoiceStatus(id: string, status: string) {
  if (!id) {
    throw new Error("Invoice ID is required");
  }
  
  if (!isValidUUID(id)) {
    throw new Error("Invalid invoice ID format");
  }
  
  const validStatuses = ['draft', 'sent', 'paid', 'pending', 'overdue'];
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid invoice status");
  }
  
  const { data, error } = await supabase
    .from("invoices")
    .update({ 
      status,
      last_status_update: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single();
  
  if (error) {
    throw new Error(`Failed to update invoice status: ${error.message}`);
  }
  
  return data;
}