
-- Drop existing permissive policies that allow all access
DROP POLICY IF EXISTS "Allow all access to clients" ON public.clients;
DROP POLICY IF EXISTS "Allow all access to invoices" ON public.invoices;
DROP POLICY IF EXISTS "Allow all access to invoice_items" ON public.invoice_items;
DROP POLICY IF EXISTS "Allow all access to invoice_templates" ON public.invoice_templates;

-- Clients: users can only access their own clients
CREATE POLICY "Users can view own clients"
  ON public.clients FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Users can insert own clients"
  ON public.clients FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update own clients"
  ON public.clients FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can delete own clients"
  ON public.clients FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- Invoices: users can only access their own invoices
CREATE POLICY "Users can view own invoices"
  ON public.invoices FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Users can insert own invoices"
  ON public.invoices FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update own invoices"
  ON public.invoices FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can delete own invoices"
  ON public.invoices FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- Invoice items: access based on parent invoice ownership
CREATE POLICY "Users can view own invoice items"
  ON public.invoice_items FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.owner_id = auth.uid()
  ));

CREATE POLICY "Users can insert own invoice items"
  ON public.invoice_items FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.owner_id = auth.uid()
  ));

CREATE POLICY "Users can update own invoice items"
  ON public.invoice_items FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.owner_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.owner_id = auth.uid()
  ));

CREATE POLICY "Users can delete own invoice items"
  ON public.invoice_items FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.owner_id = auth.uid()
  ));

-- Invoice templates: users can only access their own templates
CREATE POLICY "Users can view own templates"
  ON public.invoice_templates FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Users can insert own templates"
  ON public.invoice_templates FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update own templates"
  ON public.invoice_templates FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can delete own templates"
  ON public.invoice_templates FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- Fix owner_id defaults to use auth.uid() instead of gen_random_uuid()
ALTER TABLE public.clients ALTER COLUMN owner_id SET DEFAULT auth.uid();
ALTER TABLE public.invoices ALTER COLUMN owner_id SET DEFAULT auth.uid();
ALTER TABLE public.invoice_templates ALTER COLUMN owner_id SET DEFAULT auth.uid();
