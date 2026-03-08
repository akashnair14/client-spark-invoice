import { supabase } from "@/integrations/supabase/client";

export async function getInvoices() {
  const { data, error } = await supabase
    .from('invoices')
    .select('*, clients(company_name), invoice_items(*)')
    .order('created_at', { ascending: false });
  
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getInvoice(id: string) {
  const { data, error } = await supabase
    .from('invoices')
    .select('*, clients(company_name), invoice_items(*)')
    .eq('id', id)
    .single();
  
  if (error) throw new Error(error.message);
  return data;
}

export async function createInvoice(invoice: any, items: any[]) {
  // Insert invoice
  const { data: invoiceData, error: invoiceError } = await supabase
    .from('invoices')
    .insert(invoice)
    .select()
    .single();
  
  if (invoiceError) throw new Error(invoiceError.message);
  
  // Insert items
  if (items && items.length > 0) {
    const itemsWithInvoiceId = items.map((item, index) => ({
      ...item,
      invoice_id: invoiceData.id,
      sort_order: index,
    }));
    
    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(itemsWithInvoiceId);
    
    if (itemsError) throw new Error(itemsError.message);
  }
  
  return invoiceData;
}

export async function updateInvoice(id: string, updates: any, items?: any[]) {
  const { data, error } = await supabase
    .from('invoices')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  
  if (items) {
    // Delete existing items and re-insert
    await supabase.from('invoice_items').delete().eq('invoice_id', id);
    
    const itemsWithInvoiceId = items.map((item, index) => ({
      ...item,
      invoice_id: id,
      sort_order: index,
    }));
    
    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(itemsWithInvoiceId);
    
    if (itemsError) throw new Error(itemsError.message);
  }
  
  return data;
}

export async function deleteInvoice(id: string) {
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);
  
  if (error) throw new Error(error.message);
  return true;
}

export async function updateInvoiceStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from('invoices')
    .update({ status, last_status_update: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  return data;
}
