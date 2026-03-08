
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS company_address text DEFAULT '',
  ADD COLUMN IF NOT EXISTS company_city text DEFAULT '',
  ADD COLUMN IF NOT EXISTS company_state text DEFAULT '',
  ADD COLUMN IF NOT EXISTS company_postal_code text DEFAULT '',
  ADD COLUMN IF NOT EXISTS company_gst_number text DEFAULT '',
  ADD COLUMN IF NOT EXISTS company_email text DEFAULT '',
  ADD COLUMN IF NOT EXISTS company_phone text DEFAULT '',
  ADD COLUMN IF NOT EXISTS company_website text DEFAULT '',
  ADD COLUMN IF NOT EXISTS company_logo_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS company_bank_name text DEFAULT '',
  ADD COLUMN IF NOT EXISTS company_bank_account text DEFAULT '',
  ADD COLUMN IF NOT EXISTS company_bank_ifsc text DEFAULT '';
