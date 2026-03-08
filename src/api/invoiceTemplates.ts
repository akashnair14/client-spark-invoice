import { supabase } from "@/integrations/supabase/client";

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

export type CreateInvoiceTemplate = Omit<InvoiceTemplate, 'id' | 'created_at' | 'updated_at' | 'owner_id'>;
export type UpdateInvoiceTemplate = Partial<CreateInvoiceTemplate>;

export async function getInvoiceTemplates(): Promise<InvoiceTemplate[]> {
  const { data, error } = await supabase
    .from('invoice_templates')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw new Error(error.message);
  return (data || []) as unknown as InvoiceTemplate[];
}

export async function getInvoiceTemplate(id: string): Promise<InvoiceTemplate> {
  const { data, error } = await supabase
    .from('invoice_templates')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw new Error(error.message);
  return data as unknown as InvoiceTemplate;
}

export async function createInvoiceTemplate(template: CreateInvoiceTemplate): Promise<InvoiceTemplate> {
  const { data, error } = await supabase
    .from('invoice_templates')
    .insert(template as any)
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  return data as unknown as InvoiceTemplate;
}

export async function updateInvoiceTemplate(id: string, updates: UpdateInvoiceTemplate): Promise<InvoiceTemplate> {
  const { data, error } = await supabase
    .from('invoice_templates')
    .update({ ...updates, updated_at: new Date().toISOString() } as any)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  return data as unknown as InvoiceTemplate;
}

export async function deleteInvoiceTemplate(id: string): Promise<void> {
  const { error } = await supabase
    .from('invoice_templates')
    .delete()
    .eq('id', id);
  
  if (error) throw new Error(error.message);
}

export async function setDefaultTemplate(id: string): Promise<InvoiceTemplate> {
  // First, unset all defaults
  await supabase
    .from('invoice_templates')
    .update({ is_default: false } as any)
    .eq('is_default', true);
  
  // Then set the new default
  const { data, error } = await supabase
    .from('invoice_templates')
    .update({ is_default: true } as any)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  return data as unknown as InvoiceTemplate;
}

export async function duplicateTemplate(id: string, newName: string): Promise<InvoiceTemplate> {
  const original = await getInvoiceTemplate(id);
  
  const { data, error } = await supabase
    .from('invoice_templates')
    .insert({
      template_name: newName,
      template_type: original.template_type,
      layout_data: original.layout_data,
      is_default: false,
      is_active: true,
      paper_size: original.paper_size,
      orientation: original.orientation,
      margins: original.margins,
    } as any)
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  return data as unknown as InvoiceTemplate;
}
