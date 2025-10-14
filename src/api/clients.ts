import { apiRequest } from "@/config/api";
import type { Client, CreateClient, UpdateClient } from "@/types/api";
import { isValidUUID } from "@/utils/authUtils";

/**
 * CRUD operations on "clients" with validation and error handling
 */

export async function getClients(): Promise<Client[]> {
  return apiRequest('/clients', {
    method: 'GET',
  });
}

export async function getClient(id: string): Promise<Client> {
  if (!isValidUUID(id)) {
    throw new Error("Invalid client ID format");
  }
  
  return apiRequest(`/clients/${id}`, {
    method: 'GET',
  });
}

export async function createClient(client: CreateClient): Promise<Client> {
  // Validation
  if (!client.company_name?.trim()) {
    throw new Error("Company name is required");
  }

  return apiRequest('/clients', {
    method: 'POST',
    body: JSON.stringify(client),
  });
}

export async function updateClient(id: string, updates: UpdateClient): Promise<Client> {
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

  return apiRequest(`/clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function deleteClient(id: string): Promise<boolean> {
  if (!id) {
    throw new Error("Client ID is required");
  }
  
  if (!isValidUUID(id)) {
    throw new Error("Invalid client ID format");
  }

  await apiRequest(`/clients/${id}`, {
    method: 'DELETE',
  });
  
  return true;
}
