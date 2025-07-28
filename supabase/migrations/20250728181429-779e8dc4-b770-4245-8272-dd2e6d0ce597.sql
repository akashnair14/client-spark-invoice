-- Create seed data for testing CRUD operations
-- This creates 3 dummy clients and 5 dummy invoices with their items

-- Insert dummy clients
INSERT INTO public.clients (
  id,
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
    'client-01',
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
    'client-02', 
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
    'client-03',
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
ON CONFLICT (id) DO NOTHING;

-- Insert dummy invoices
INSERT INTO public.invoices (
  id,
  owner_id,
  client_id,
  invoice_number,
  date,
  due_date,
  subtotal,
  gst_amount,
  total,
  status,
  gst_type,
  notes
) VALUES 
  (
    'inv-001',
    auth.uid(),
    'client-01',
    'INV-2025-001',
    '2025-01-15',
    '2025-02-14',
    12711.86,
    2288.13,
    15000.00,
    'paid',
    'regular',
    'Website development project - Phase 1 completed'
  ),
  (
    'inv-002',
    auth.uid(),
    'client-02',
    'INV-2025-002',
    '2025-01-20',
    '2025-02-19',
    6779.66,
    1220.34,
    8000.00,
    'pending',
    'regular',
    'Mobile app development consultation'
  ),
  (
    'inv-003',
    auth.uid(),
    'client-03',
    'INV-2025-003',
    '2025-01-10',
    '2025-02-09',
    10169.49,
    1830.51,
    12000.00,
    'overdue',
    'regular',
    'Database optimization and maintenance'
  ),
  (
    'inv-004',
    auth.uid(),
    'client-01',
    'INV-2025-004',
    '2025-01-25',
    '2025-02-24',
    5084.75,
    915.25,
    6000.00,
    'pending',
    'regular',
    'SEO optimization services'
  ),
  (
    'inv-005',
    auth.uid(),
    'client-02',
    'INV-2025-005',
    '2025-01-28',
    '2025-02-27',
    8474.58,
    1525.42,
    10000.00,
    'draft',
    'regular',
    'Cloud infrastructure setup'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert dummy invoice items
INSERT INTO public.invoice_items (
  invoice_id,
  description,
  hsn_code,
  quantity,
  rate,
  gst_rate,
  cgst_rate,
  sgst_rate,
  amount,
  sort_order
) VALUES 
  -- Items for INV-001
  ('inv-001', 'Frontend Development (React)', '998313', 40, 200.00, 18, 9, 9, 8000.00, 0),
  ('inv-001', 'Backend API Development', '998313', 25, 150.00, 18, 9, 9, 3750.00, 1),
  ('inv-001', 'Database Design & Setup', '998313', 12, 80.33, 18, 9, 9, 961.96, 2),
  
  -- Items for INV-002  
  ('inv-002', 'Mobile App UI/UX Design', '998313', 30, 120.00, 18, 9, 9, 3600.00, 0),
  ('inv-002', 'Technical Consultation', '998313', 20, 158.98, 18, 9, 9, 3179.66, 1),
  
  -- Items for INV-003
  ('inv-003', 'Database Performance Audit', '998313', 15, 300.00, 18, 9, 9, 4500.00, 0),
  ('inv-003', 'Query Optimization', '998313', 25, 180.00, 18, 9, 9, 4500.00, 1),
  ('inv-003', 'Maintenance Documentation', '998313', 8, 146.19, 18, 9, 9, 1169.49, 2),
  
  -- Items for INV-004
  ('inv-004', 'SEO Audit & Analysis', '998313', 10, 250.00, 18, 9, 9, 2500.00, 0),
  ('inv-004', 'Content Optimization', '998313', 15, 172.32, 18, 9, 9, 2584.75, 1),
  
  -- Items for INV-005
  ('inv-005', 'AWS Infrastructure Setup', '998313', 20, 200.00, 18, 9, 9, 4000.00, 0),
  ('inv-005', 'CI/CD Pipeline Configuration', '998313', 18, 180.00, 18, 9, 9, 3240.00, 1),
  ('inv-005', 'Security Configuration', '998313', 8, 154.32, 18, 9, 9, 1234.58, 2)
ON CONFLICT DO NOTHING;