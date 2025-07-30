export interface TemplateComponent {
  id: string;
  type: 'header' | 'invoice-details' | 'client-info' | 'items-table' | 'totals' | 'notes' | 'logo' | 'signature' | 'qr-code';
  position: { x: number; y: number }; // Percentage-based positioning
  size: { width: number; height: number }; // Percentage-based sizing
  styles: {
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    textAlign?: 'left' | 'center' | 'right';
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: string;
    borderStyle?: string;
    padding?: string;
    margin?: string;
  };
  data?: Record<string, any>;
  fields?: string[]; // For components that display multiple fields
  columns?: string[]; // For table components
  isVisible?: boolean;
  isLocked?: boolean;
}

export interface TemplateTheme {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  borderColor: string;
  backgroundColor?: string;
  accentColor?: string;
}

export interface TemplateLayout {
  components: TemplateComponent[];
  theme: TemplateTheme;
  settings?: {
    showBorders?: boolean;
    gridSize?: number;
    snapToGrid?: boolean;
  };
}

export interface TemplateMargins {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface InvoiceTemplateData {
  id?: string;
  template_name: string;
  layout_data: TemplateLayout;
  client_id?: string;
  is_default: boolean;
  is_active: boolean;
  template_type: 'custom' | 'system' | 'industry';
  paper_size: 'A4' | 'Letter' | 'Legal' | 'Custom';
  orientation: 'portrait' | 'landscape';
  margins: TemplateMargins;
}

// Component type definitions for the designer
export interface ComponentDefinition {
  type: TemplateComponent['type'];
  label: string;
  icon: string;
  defaultSize: { width: number; height: number };
  defaultStyles: TemplateComponent['styles'];
  configurable: {
    fields?: boolean;
    columns?: boolean;
    styles?: boolean;
    data?: boolean;
  };
  description: string;
}

// Data binding tokens
export interface DataTokens {
  company: {
    name: string;
    address: string;
    phone: string;
    email: string;
    gst: string;
    logo: string;
  };
  invoice: {
    number: string;
    date: string;
    dueDate: string;
    subtotal: number;
    gstAmount: number;
    total: number;
    notes: string;
    challanNumber?: string;
    poNumber?: string;
  };
  client: {
    companyName: string;
    contactName: string;
    address: string;
    gstNumber: string;
    phone: string;
    email: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    hsnCode: string;
    gstRate: number;
    amount: number;
  }>;
}