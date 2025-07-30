import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type InvoiceTemplate = Database["public"]["Tables"]["invoice_templates"]["Row"];
export type CreateInvoiceTemplate = Omit<Database["public"]["Tables"]["invoice_templates"]["Insert"], "owner_id">;
export type UpdateInvoiceTemplate = Database["public"]["Tables"]["invoice_templates"]["Update"];

export const getInvoiceTemplates = async (): Promise<InvoiceTemplate[]> => {
  const { data, error } = await supabase
    .from('invoice_templates')
    .select('*')
    .eq('is_active', true)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch invoice templates: ${error.message}`);
  }

  return data || [];
};

export const getInvoiceTemplate = async (id: string): Promise<InvoiceTemplate> => {
  if (!id || !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
    throw new Error('Invalid template ID format');
  }

  const { data, error } = await supabase
    .from('invoice_templates')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch invoice template: ${error.message}`);
  }

  return data;
};

export const createInvoiceTemplate = async (template: CreateInvoiceTemplate): Promise<InvoiceTemplate> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  // If setting as default, unset other defaults first
  if (template.is_default) {
    await supabase
      .from('invoice_templates')
      .update({ is_default: false })
      .eq('owner_id', user.id)
      .eq('is_default', true);
  }

  const { data, error } = await supabase
    .from('invoice_templates')
    .insert({
      ...template,
      owner_id: user.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create invoice template: ${error.message}`);
  }

  return data;
};

export const updateInvoiceTemplate = async (id: string, updates: UpdateInvoiceTemplate): Promise<InvoiceTemplate> => {
  if (!id || !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
    throw new Error('Invalid template ID format');
  }

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  // If setting as default, unset other defaults first
  if (updates.is_default) {
    await supabase
      .from('invoice_templates')
      .update({ is_default: false })
      .eq('owner_id', user.id)
      .eq('is_default', true);
  }

  const { data, error } = await supabase
    .from('invoice_templates')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update invoice template: ${error.message}`);
  }

  return data;
};

export const deleteInvoiceTemplate = async (id: string): Promise<void> => {
  if (!id || !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
    throw new Error('Invalid template ID format');
  }

  const { error } = await supabase
    .from('invoice_templates')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete invoice template: ${error.message}`);
  }
};

export const setDefaultTemplate = async (id: string): Promise<void> => {
  if (!id || !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
    throw new Error('Invalid template ID format');
  }

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Unset all defaults for this user
  await supabase
    .from('invoice_templates')
    .update({ is_default: false })
    .eq('owner_id', user.id)
    .eq('is_default', true);

  // Set new default
  const { error } = await supabase
    .from('invoice_templates')
    .update({ is_default: true })
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to set default template: ${error.message}`);
  }
};

export const duplicateTemplate = async (id: string, newName: string): Promise<InvoiceTemplate> => {
  // Get the original template
  const original = await getInvoiceTemplate(id);
  
  // Create a copy
  return createInvoiceTemplate({
    template_name: newName,
    layout_data: original.layout_data,
    client_id: original.client_id,
    is_default: false,
    template_type: 'custom',
    paper_size: original.paper_size,
    orientation: original.orientation,
    margins: original.margins,
  });
};