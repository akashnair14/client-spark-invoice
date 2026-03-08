import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export interface PaginatedResult<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Fetch all invoices (no pagination) */
export async function getInvoices() {
  const { data, error } = await supabase
    .from('invoices')
    .select('*, clients(company_name), invoice_items(*)')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

/** Fetch invoices with server-side pagination */
export async function getInvoicesPaginated(page = 1, pageSize = 50) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('invoices')
    .select('*, clients(company_name), invoice_items(*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);
  return {
    data: data || [],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  } satisfies PaginatedResult<(typeof data)[0]>;
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

export async function createInvoice(
  invoice: TablesInsert<'invoices'>,
  items: TablesInsert<'invoice_items'>[]
) {
  const { data: invoiceData, error: invoiceError } = await supabase
    .from('invoices')
    .insert(invoice)
    .select()
    .single();

  if (invoiceError) throw new Error(invoiceError.message);

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

export async function updateInvoice(
  id: string,
  updates: TablesUpdate<'invoices'>,
  items?: TablesInsert<'invoice_items'>[]
) {
  const { data, error } = await supabase
    .from('invoices')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  if (items) {
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
