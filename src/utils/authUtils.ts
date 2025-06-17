
import { supabase } from "@/integrations/supabase/client";

/**
 * Get the current authenticated user's ID
 * @returns Promise<string> - The user's UUID
 * @throws Error if user is not authenticated
 */
export async function getCurrentUserId(): Promise<string> {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    throw new Error(`Authentication error: ${error.message}`);
  }
  
  if (!user) {
    throw new Error("User not authenticated");
  }
  
  return user.id;
}

/**
 * Check if a string is a valid UUID
 * @param uuid - String to validate
 * @returns boolean
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Generate a random UUID v4
 * @returns string - A valid UUID
 */
export function generateUUID(): string {
  return crypto.randomUUID();
}
