import { supabase } from "@/integrations/supabase/client";

/**
 * Get the current authenticated user's ID
 */
export async function getCurrentUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.id) throw new Error("User not authenticated");
  return user.id;
}

/**
 * Check if a string is a valid UUID
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Generate a random UUID v4
 */
export function generateUUID(): string {
  return crypto.randomUUID();
}
