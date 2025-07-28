-- Create seed data for testing CRUD operations with proper UUIDs
-- This creates 3 dummy clients and 5 dummy invoices with their items

-- Insert dummy clients with generated UUIDs
INSERT INTO public.clients (
  owner_id,
  company_name,
  contact_name,
  gst_number,
  phone_number,
  email,
  address,
  city,
  state,
  postal_code,
  website,
  tags,
  status
) VALUES 
  (
    auth.uid(),
    'Acme Corporation Ltd.',
    'Alice Smith',
    'GST123456789',
    '+91-9000000001',
    'alice@acme.com',
    '123 Business Street, Business Tower',
    'Mumbai',
    'Maharashtra',
    '400001',
    'https://acme.com',
    ARRAY['priority', 'enterprise'],
    'active'
  ),
  (
    auth.uid(),
    'Globex Industries Pvt. Ltd.',
    'Bob Johnson',
    'GST987654321',
    '+91-9000000002',
    'bob@globex.com',
    '456 Market Avenue, Tech Park',
    'Delhi',
    'Delhi',
    '110001',
    'https://globex.com',
    ARRAY['new', 'tech'],
    'active'
  ),
  (
    auth.uid(),
    'Initech Solutions',
    'Carol King',
    'GST555222111',
    '+91-9000000003',
    'carol@initech.com',
    '789 Innovation Hub, Sector 5',
    'Bangalore',
    'Karnataka',
    '560001',
    'https://initech.com',
    ARRAY['startup'],
    'active'
  )
ON CONFLICT DO NOTHING;