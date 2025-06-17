
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { isValidUUID } from "@/utils/authUtils";

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
  if (!isValidUUID(id)) {
    throw new Error("Invalid client ID format");
  }
  
  const { data, error } = await supabase.from(table).select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Client not found");
  return data;
}

export async function createClient(client: Database["public"]["Tables"]["clients"]["Insert"]) {
  // Validation
  if (!client.company_name?.trim()) {
    throw new Error("Company name is required");
  }
  
  if (!client.owner_id) {
    throw new Error("Owner ID is required");
  }
  
  if (!isValidUUID(client.owner_id)) {
    throw new Error("Invalid owner ID format");
  }

  const { data, error } = await supabase.from(table).insert(client).select().single();
  if (error) {
    // Provide more specific error messages for common issues
    if (error.code === '23505') {
      throw new Error("A client with this information already exists");
    }
    if (error.code === '23503') {
      throw new Error("Invalid owner ID - user does not exist");
    }
    throw new Error(`Failed to create client: ${error.message}`);
  }
  return data;
}

export async function updateClient(id: string, updates: Partial<Database["public"]["Tables"]["clients"]["Update"]>) {
  if (!id) {
    throw new Error("Client ID is required");
  }
  
  if (!isValidUUID(id)) {
    throw new Error("Invalid client ID format");
  }
  
  // Validate that we're not trying to update with empty required fields
  if (updates.company_name !== undefined && !updates.company_name?.trim()) {
    throw new Error("Company name cannot be empty");
  }

  const { data, error } = await supabase.from(table).update(updates).eq("id", id).select().single();
  if (error) {
    if (error.code === '23505') {
      throw new Error("A client with this information already exists");
    }
    throw new Error(`Failed to update client: ${error.message}`);
  }
  return data;
}

export async function deleteClient(id: string) {
  if (!id) {
    throw new Error("Client ID is required");
  }
  
  if (!isValidUUID(id)) {
    throw new Error("Invalid client ID format");
  }

  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) {
    throw new Error(`Failed to delete client: ${error.message}`);
  }
  return true;
}
