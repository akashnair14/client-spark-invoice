
-- 1. Roles Enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. User Roles Table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role),
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer to check role without recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- 3. Clients table
CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL, -- user who created this client
  company_name TEXT NOT NULL,
  contact_name TEXT,
  gst_number TEXT,
  phone_number TEXT,
  email TEXT,
  bank_account_number TEXT,
  bank_details TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  website TEXT,
  tags TEXT[],
  status TEXT,
  last_invoice_date DATE,
  total_invoiced NUMERIC,
  pending_invoices INT,
  fy_invoices INT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Admins can do everything, users can only see/edit their own clients
CREATE POLICY "Only owner or admin can view clients"
ON public.clients FOR SELECT
USING (
  owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Only owner or admin can insert clients"
ON public.clients FOR INSERT
WITH CHECK (
  owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Only owner or admin can update clients"
ON public.clients FOR UPDATE
USING (
  owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Only owner or admin can delete clients"
ON public.clients FOR DELETE
USING (
  owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin')
);
