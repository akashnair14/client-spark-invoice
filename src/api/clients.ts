
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

/**
 * CRUD operations on "clients" table with validation and error handling
 */

const table = "clients";

export async function getClients() {
  const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getClient(id: string) {
  const { data, error } = await supabase.from(table).select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Not found");
  return data;
}

export async function createClient(client: Partial<Database["public"]["Tables"]["clients"]["Insert"]>) {
  // Simple validation example
  if (!client.company_name) throw new Error("Company name required");
  if (!client.owner_id) throw new Error("Missing owner_id");
  const { data, error } = await supabase.from(table).insert([client]).select().maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateClient(id: string, updates: Partial<Database["public"]["Tables"]["clients"]["Update"]>) {
  if (!id) throw new Error("Missing client ID");
  const { data, error } = await supabase.from(table).update(updates).eq("id", id).select().maybeSingle();
  if (error) throw error;
  return data;
}

export async function deleteClient(id: string) {
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
  return true;
}
