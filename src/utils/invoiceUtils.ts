
import { InvoiceItem } from "@/types";

/**
 * Calculate the subtotal of invoice items
 */
export const calculateSubtotal = (items: InvoiceItem[]): number => {
  return items.reduce((sum, item) => sum + item.amount, 0);
};

/**
 * Calculate the GST amount of invoice items
 */
export const calculateGstAmount = (items: InvoiceItem[]): number => {
  return items.reduce((sum, item) => sum + (item.amount * item.gstRate / 100), 0);
};

/**
 * Format currency amount
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Generate a new invoice number
 */
export const generateInvoiceNumber = (): string => {
  const now = new Date();
  return `INV-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
};
