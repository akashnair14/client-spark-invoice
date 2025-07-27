-- Create invoices table to store invoice data
CREATE TABLE public.invoices (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  owner_id uuid NOT NULL,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  
  -- Invoice identification
  invoice_number text NOT NULL,
  date date NOT NULL,
  due_date date,
  
  -- Invoice status and tracking
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'pending', 'overdue')),
  last_status_update timestamp with time zone DEFAULT now(),
  
  -- Tax configuration
  gst_type text NOT NULL DEFAULT 'regular' CHECK (gst_type IN ('regular', 'igst')),
  
  -- Totals (calculated from items)
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  gst_amount numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  
  -- Additional details
  notes text,
  challan_number text,
  challan_date date,
  po_number text,
  po_date date,
  dc_number text,
  dc_date date,
  ewb_number text,
  
  -- Constraints
  UNIQUE(owner_id, invoice_number)
);

-- Create invoice_items table to store individual line items
CREATE TABLE public.invoice_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  
  -- Item details
  description text NOT NULL,
  quantity numeric(10,2) NOT NULL DEFAULT 1,
  hsn_code text NOT NULL,
  rate numeric(10,2) NOT NULL DEFAULT 0,
  
  -- Tax rates
  gst_rate numeric(5,2) NOT NULL DEFAULT 0,
  cgst_rate numeric(5,2) NOT NULL DEFAULT 0,
  sgst_rate numeric(5,2) NOT NULL DEFAULT 0,
  
  -- Calculated amount
  amount numeric(10,2) NOT NULL DEFAULT 0,
  
  -- Sort order for display
  sort_order integer NOT NULL DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for invoices
CREATE POLICY "Users can view their own invoices" 
ON public.invoices 
FOR SELECT 
USING (owner_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create their own invoices" 
ON public.invoices 
FOR INSERT 
WITH CHECK (owner_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can update their own invoices" 
ON public.invoices 
FOR UPDATE 
USING (owner_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can delete their own invoices" 
ON public.invoices 
FOR DELETE 
USING (owner_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- Create RLS policies for invoice_items
CREATE POLICY "Users can view items of their invoices" 
ON public.invoice_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.invoices 
    WHERE invoices.id = invoice_items.invoice_id 
    AND (invoices.owner_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  )
);

CREATE POLICY "Users can create items for their invoices" 
ON public.invoice_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.invoices 
    WHERE invoices.id = invoice_items.invoice_id 
    AND (invoices.owner_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  )
);

CREATE POLICY "Users can update items of their invoices" 
ON public.invoice_items 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.invoices 
    WHERE invoices.id = invoice_items.invoice_id 
    AND (invoices.owner_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  )
);

CREATE POLICY "Users can delete items of their invoices" 
ON public.invoice_items 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.invoices 
    WHERE invoices.id = invoice_items.invoice_id 
    AND (invoices.owner_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  )
);

-- Create indexes for better performance
CREATE INDEX idx_invoices_owner_id ON public.invoices(owner_id);
CREATE INDEX idx_invoices_client_id ON public.invoices(client_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoices_date ON public.invoices(date);
CREATE INDEX idx_invoices_invoice_number ON public.invoices(invoice_number);
CREATE INDEX idx_invoice_items_invoice_id ON public.invoice_items(invoice_id);
CREATE INDEX idx_invoice_items_sort_order ON public.invoice_items(invoice_id, sort_order);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically update invoice totals when items change
CREATE OR REPLACE FUNCTION public.update_invoice_totals()
RETURNS TRIGGER AS $$
DECLARE
  invoice_id_param uuid;
  calc_subtotal numeric(10,2);
  calc_gst_amount numeric(10,2);
  calc_total numeric(10,2);
BEGIN
  -- Get the invoice_id from the operation
  IF TG_OP = 'DELETE' THEN
    invoice_id_param := OLD.invoice_id;
  ELSE
    invoice_id_param := NEW.invoice_id;
  END IF;
  
  -- Calculate totals
  SELECT 
    COALESCE(SUM(amount), 0),
    COALESCE(SUM(amount * gst_rate / 100), 0),
    COALESCE(SUM(amount + (amount * gst_rate / 100)), 0)
  INTO calc_subtotal, calc_gst_amount, calc_total
  FROM public.invoice_items
  WHERE invoice_id = invoice_id_param;
  
  -- Update the invoice
  UPDATE public.invoices 
  SET 
    subtotal = calc_subtotal,
    gst_amount = calc_gst_amount,
    total = calc_total,
    updated_at = now()
  WHERE id = invoice_id_param;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers to auto-update invoice totals
CREATE TRIGGER update_invoice_totals_on_item_change
  AFTER INSERT OR UPDATE OR DELETE ON public.invoice_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_invoice_totals();