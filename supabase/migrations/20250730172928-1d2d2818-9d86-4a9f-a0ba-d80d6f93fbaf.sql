-- Create invoice_templates table for custom invoice layouts
CREATE TABLE public.invoice_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  client_id UUID NULL, -- NULL means it's a global template, specific client_id means client-specific
  template_name TEXT NOT NULL,
  layout_data JSONB NOT NULL DEFAULT '{}', -- stores layout positions, elements, styles
  is_default BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  template_type TEXT NOT NULL DEFAULT 'custom', -- 'custom', 'system', 'industry'
  paper_size TEXT NOT NULL DEFAULT 'A4', -- 'A4', 'Letter', 'Custom'
  orientation TEXT NOT NULL DEFAULT 'portrait', -- 'portrait', 'landscape'
  margins JSONB NOT NULL DEFAULT '{"top": 20, "bottom": 20, "left": 20, "right": 20}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.invoice_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for invoice_templates
CREATE POLICY "Users can view their own templates" 
ON public.invoice_templates 
FOR SELECT 
USING (owner_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create their own templates" 
ON public.invoice_templates 
FOR INSERT 
WITH CHECK (owner_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can update their own templates" 
ON public.invoice_templates 
FOR UPDATE 
USING (owner_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can delete their own templates" 
ON public.invoice_templates 
FOR DELETE 
USING (owner_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_invoice_templates_updated_at
BEFORE UPDATE ON public.invoice_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_invoice_templates_owner_id ON public.invoice_templates(owner_id);
CREATE INDEX idx_invoice_templates_client_id ON public.invoice_templates(client_id);
CREATE INDEX idx_invoice_templates_is_default ON public.invoice_templates(is_default) WHERE is_default = true;

-- Add foreign key constraint to clients table (optional, allows orphaned global templates)
ALTER TABLE public.invoice_templates 
ADD CONSTRAINT fk_invoice_templates_client_id 
FOREIGN KEY (client_id) REFERENCES public.clients(id) 
ON DELETE SET NULL;

-- Insert default system templates
INSERT INTO public.invoice_templates (
  owner_id, 
  template_name, 
  layout_data, 
  is_default, 
  template_type,
  paper_size,
  orientation
) VALUES 
-- Default modern template
(
  '00000000-0000-0000-0000-000000000000', -- System user
  'Modern Professional',
  '{
    "components": [
      {
        "id": "header",
        "type": "header",
        "position": {"x": 0, "y": 0},
        "size": {"width": 100, "height": 15},
        "styles": {"fontSize": "24px", "fontWeight": "bold", "textAlign": "center"},
        "data": {"title": "{{company.name}}", "subtitle": "INVOICE"}
      },
      {
        "id": "invoice-details",
        "type": "invoice-details",
        "position": {"x": 0, "y": 20},
        "size": {"width": 50, "height": 20},
        "styles": {"fontSize": "12px"},
        "fields": ["invoiceNumber", "date", "dueDate"]
      },
      {
        "id": "client-info",
        "type": "client-info",
        "position": {"x": 50, "y": 20},
        "size": {"width": 50, "height": 20},
        "styles": {"fontSize": "12px"},
        "fields": ["companyName", "address", "gstNumber"]
      },
      {
        "id": "items-table",
        "type": "items-table",
        "position": {"x": 0, "y": 45},
        "size": {"width": 100, "height": 40},
        "styles": {"fontSize": "11px"},
        "columns": ["description", "quantity", "rate", "gstRate", "amount"]
      },
      {
        "id": "totals",
        "type": "totals",
        "position": {"x": 60, "y": 88},
        "size": {"width": 40, "height": 10},
        "styles": {"fontSize": "12px", "textAlign": "right"}
      }
    ],
    "theme": {
      "primaryColor": "hsl(var(--primary))",
      "secondaryColor": "hsl(var(--secondary))",
      "textColor": "hsl(var(--foreground))",
      "borderColor": "hsl(var(--border))"
    }
  }'::jsonb,
  true,
  'system',
  'A4',
  'portrait'
),
-- Minimal template
(
  '00000000-0000-0000-0000-000000000000',
  'Minimal Clean',
  '{
    "components": [
      {
        "id": "header",
        "type": "header",
        "position": {"x": 0, "y": 0},
        "size": {"width": 100, "height": 10},
        "styles": {"fontSize": "20px", "fontWeight": "normal", "textAlign": "left"},
        "data": {"title": "Invoice"}
      },
      {
        "id": "invoice-details",
        "type": "invoice-details",
        "position": {"x": 0, "y": 15},
        "size": {"width": 50, "height": 15},
        "styles": {"fontSize": "11px"},
        "fields": ["invoiceNumber", "date"]
      },
      {
        "id": "client-info",
        "type": "client-info",
        "position": {"x": 50, "y": 15},
        "size": {"width": 50, "height": 15},
        "styles": {"fontSize": "11px"},
        "fields": ["companyName", "address"]
      },
      {
        "id": "items-table",
        "type": "items-table",
        "position": {"x": 0, "y": 35},
        "size": {"width": 100, "height": 50},
        "styles": {"fontSize": "10px"},
        "columns": ["description", "quantity", "rate", "amount"]
      },
      {
        "id": "totals",
        "type": "totals",
        "position": {"x": 70, "y": 88},
        "size": {"width": 30, "height": 8},
        "styles": {"fontSize": "11px", "textAlign": "right"}
      }
    ],
    "theme": {
      "primaryColor": "hsl(var(--foreground))",
      "secondaryColor": "hsl(var(--muted-foreground))",
      "textColor": "hsl(var(--foreground))",
      "borderColor": "hsl(var(--border))"
    }
  }'::jsonb,
  false,
  'system',
  'A4',
  'portrait'
);