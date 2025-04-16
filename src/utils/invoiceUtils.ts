
import { InvoiceItem } from "@/types";

/**
 * Calculate the subtotal of invoice items
 */
export const calculateSubtotal = (items: InvoiceItem[]): number => {
  // Ensure all required properties exist before calculation
  const validItems = items.filter(item => 
    item && typeof item.quantity === 'number' && 
    typeof item.rate === 'number' && 
    item.id !== undefined
  ) as InvoiceItem[];
  
  return validItems.reduce((sum, item) => sum + Number(item.quantity * item.rate), 0);
};

/**
 * Calculate the GST amount of invoice items
 */
export const calculateGstAmount = (items: InvoiceItem[]): number => {
  // Ensure all required properties exist before calculation
  const validItems = items.filter(item => 
    item && typeof item.quantity === 'number' && 
    typeof item.rate === 'number' && 
    typeof item.cgstRate === 'number' &&
    typeof item.sgstRate === 'number' &&
    item.id !== undefined
  ) as InvoiceItem[];
  
  return validItems.reduce((sum, item) => {
    const itemValue = Number(item.quantity) * Number(item.rate);
    const cgstAmount = itemValue * (Number(item.cgstRate) / 100);
    const sgstAmount = itemValue * (Number(item.sgstRate) / 100);
    return sum + cgstAmount + sgstAmount;
  }, 0);
};

/**
 * Calculate roundoff amount to the nearest integer
 */
export const calculateRoundoff = (subtotal: number, gstAmount: number): number => {
  const exactTotal = parseFloat((subtotal + gstAmount).toFixed(2));
  const roundedTotal = Math.round(exactTotal);
  return parseFloat((roundedTotal - exactTotal).toFixed(2));
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

/**
 * Calculate the total amount of an invoice (including roundoff)
 */
export const calculateTotalAmount = (items: InvoiceItem[]): number => {
  const subtotal = calculateSubtotal(items);
  const gstAmount = calculateGstAmount(items);
  const roundoff = calculateRoundoff(subtotal, gstAmount);
  return parseFloat((subtotal + gstAmount + roundoff).toFixed(2));
};
