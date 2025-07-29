/**
 * Application Constants
 * Centralized configuration and constants for the application
 */

// Application Information
export const APP_CONFIG = {
  name: "Invoice Management System",
  version: "1.0.0",
  description: "Professional invoice and client management solution",
  author: "Your Company",
} as const;

// Business Constants
export const BUSINESS_CONFIG = {
  defaultGstRate: 18,
  defaultCgstRate: 9,
  defaultSgstRate: 9,
  currencyCode: "INR",
  currencySymbol: "₹",
  financialYearStartMonth: 3, // April (0-indexed)
} as const;

// Invoice Status Options
export const INVOICE_STATUS = {
  DRAFT: "draft",
  SENT: "sent", 
  PENDING: "pending",
  PAID: "paid",
  OVERDUE: "overdue",
} as const;

export const INVOICE_STATUS_LABELS = {
  [INVOICE_STATUS.DRAFT]: "Draft",
  [INVOICE_STATUS.SENT]: "Sent",
  [INVOICE_STATUS.PENDING]: "Pending",
  [INVOICE_STATUS.PAID]: "Paid",
  [INVOICE_STATUS.OVERDUE]: "Overdue",
} as const;

// Client Status Options
export const CLIENT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
  BLOCKED: "blocked",
} as const;

export const CLIENT_STATUS_LABELS = {
  [CLIENT_STATUS.ACTIVE]: "Active",
  [CLIENT_STATUS.INACTIVE]: "Inactive", 
  [CLIENT_STATUS.PENDING]: "Pending",
  [CLIENT_STATUS.BLOCKED]: "Blocked",
} as const;

// Common Tag Options
export const COMMON_TAGS = [
  "VIP",
  "Frequent",
  "New",
  "Delayed Payer",
  "Bulk Orders",
  "Seasonal",
  "Corporate",
  "SME",
] as const;

// Pagination Settings
export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50],
  maxPageSize: 100,
} as const;

// Validation Constants
export const VALIDATION = {
  gstNumberRegex: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  phoneNumberMinLength: 10,
  phoneNumberMaxLength: 15,
  companyNameMaxLength: 255,
  descriptionMaxLength: 500,
  notesMaxLength: 1000,
} as const;

// Date Formats
export const DATE_FORMATS = {
  display: "dd-MMM-yy",
  input: "yyyy-MM-dd",
  full: "MMMM dd, yyyy",
  short: "MMM dd",
  iso: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  network: "Network error. Please check your connection and try again.",
  unauthorized: "You are not authorized to perform this action.",
  notFound: "The requested resource was not found.",
  validation: "Please check your input and try again.",
  generic: "An unexpected error occurred. Please try again.",
  timeout: "Request timed out. Please try again.",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  clientCreated: "Client created successfully",
  clientUpdated: "Client updated successfully", 
  clientDeleted: "Client deleted successfully",
  invoiceCreated: "Invoice created successfully",
  invoiceUpdated: "Invoice updated successfully",
  invoiceDeleted: "Invoice deleted successfully",
  statusUpdated: "Status updated successfully",
  exported: "Data exported successfully",
} as const;

// API Configuration
export const API_CONFIG = {
  timeout: 10000, // 10 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
} as const;

// Feature Flags
export const FEATURES = {
  enableWhatsAppSharing: true,
  enablePdfExport: true,
  enableBulkOperations: true,
  enableAdvancedFilters: true,
  enableRealTimeUpdates: false, // Future feature
  enableMultiCurrency: false, // Future feature
  enablePaymentIntegration: false, // Future feature
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  theme: "invoice-app-theme",
  user: "invoice-app-user",
  invoices: "invoices", // Temporary until API integration
  recentSearch: "invoice-app-recent-search",
  preferences: "invoice-app-preferences",
} as const;

// Chart Colors (HSL values for consistency with design system)
export const CHART_COLORS = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  accent: "hsl(var(--accent))",
  muted: "hsl(var(--muted))",
  success: "hsl(142, 76%, 36%)",
  warning: "hsl(38, 92%, 50%)",
  error: "hsl(0, 84%, 60%)",
  info: "hsl(217, 91%, 60%)",
} as const;

// Component Size Variants
export const SIZES = {
  xs: "xs",
  sm: "sm", 
  md: "md",
  lg: "lg",
  xl: "xl",
} as const;

// Animation Durations (in milliseconds)
export const ANIMATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
  extraSlow: 1000,
} as const;

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

// Company Information (to be configured per installation)
export const COMPANY_INFO = {
  name: "Your Company Name",
  address: "123 Business Street",
  city: "Business City",
  state: "Business State",
  postalCode: "12345",
  country: "India",
  gstNumber: "27AAPFU0939F1ZV",
  phone: "+91 9876543210",
  email: "contact@yourcompany.com",
  website: "www.yourcompany.com",
} as const;

// Export types for better TypeScript integration
export type InvoiceStatus = typeof INVOICE_STATUS[keyof typeof INVOICE_STATUS];
export type ClientStatus = typeof CLIENT_STATUS[keyof typeof CLIENT_STATUS];
export type AppSize = typeof SIZES[keyof typeof SIZES];
export type CommonTag = typeof COMMON_TAGS[number];