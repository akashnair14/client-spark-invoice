import { apiRequest } from "@/config/api";
import type { InvoiceTemplate, CreateInvoiceTemplate, UpdateInvoiceTemplate } from "@/types/api";

export type { InvoiceTemplate, CreateInvoiceTemplate, UpdateInvoiceTemplate };

export const getInvoiceTemplates = async (): Promise<InvoiceTemplate[]> => {
  return apiRequest('/invoice-templates', {
    method: 'GET',
  });
};

export const getInvoiceTemplate = async (id: string): Promise<InvoiceTemplate> => {
  return apiRequest(`/invoice-templates/${id}`, {
    method: 'GET',
  });
};

export const createInvoiceTemplate = async (
  template: CreateInvoiceTemplate
): Promise<InvoiceTemplate> => {
  return apiRequest('/invoice-templates', {
    method: 'POST',
    body: JSON.stringify(template),
  });
};

export const updateInvoiceTemplate = async (
  id: string,
  updates: UpdateInvoiceTemplate
): Promise<InvoiceTemplate> => {
  return apiRequest(`/invoice-templates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
};

export const deleteInvoiceTemplate = async (id: string): Promise<void> => {
  await apiRequest(`/invoice-templates/${id}`, {
    method: 'DELETE',
  });
};

export const setDefaultTemplate = async (id: string): Promise<InvoiceTemplate> => {
  return apiRequest(`/invoice-templates/${id}/set-default`, {
    method: 'PATCH',
  });
};

export const duplicateTemplate = async (
  id: string,
  newName: string
): Promise<InvoiceTemplate> => {
  return apiRequest(`/invoice-templates/${id}/duplicate`, {
    method: 'POST',
    body: JSON.stringify({ newName }),
  });
};
