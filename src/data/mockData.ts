
import { Client, Invoice } from '../types';

export const mockClients: Client[] = [
  {
    id: '1',
    companyName: 'Tech Solutions Ltd',
    contactName: 'Rajesh Kumar',
    gstNumber: '27AAPFU0939F1ZV',
    phoneNumber: '+91 9876543210',
    phone: '+91 9876543210',
    email: 'contact@techsolutions.com',
    bankAccountNumber: '37892073891',
    bankDetails: 'HDFC Bank, Branch: Andheri East, IFSC: HDFC0001402',
    address: '123 Tech Park',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400093',
    website: 'https://techsolutions.com'
  },
  {
    id: '2',
    companyName: 'Green Builders Pvt Ltd',
    contactName: 'Priya Sharma',
    gstNumber: '29AABCR1234C1ZX',
    phoneNumber: '+91 8765432109',
    phone: '+91 8765432109',
    email: 'info@greenbuilders.in',
    bankAccountNumber: '20384756123',
    bankDetails: 'ICICI Bank, Branch: Whitefield, IFSC: ICIC0006543',
    address: '45 Green Avenue',
    city: 'Bangalore',
    state: 'Karnataka',
    postalCode: '560066',
    website: 'https://greenbuilders.in'
  },
  {
    id: '3',
    companyName: 'Global Exports Inc',
    contactName: 'Vikram Patel',
    gstNumber: '33AAACG7543R1ZM',
    phoneNumber: '+91 7654321098',
    phone: '+91 7654321098',
    email: 'exports@globalinc.com',
    bankAccountNumber: '10293847561',
    bankDetails: 'SBI, Branch: Anna Nagar, IFSC: SBIN0007321',
    address: '78 Trade Center',
    city: 'Chennai',
    state: 'Tamil Nadu',
    postalCode: '600040',
    website: 'https://globalexports.com'
  },
  {
    id: '4',
    companyName: 'Smart Retail Solutions',
    contactName: 'Ananya Singh',
    gstNumber: '07AABCS1234D1Z1',
    phoneNumber: '+91 9988776655',
    phone: '+91 9988776655',
    email: 'info@smartretail.com',
    bankAccountNumber: '82736450912',
    bankDetails: 'Axis Bank, Branch: Connaught Place, IFSC: UTIB0000007',
    address: '212 Market Complex',
    city: 'New Delhi',
    state: 'Delhi',
    postalCode: '110001',
    website: 'https://smartretail.com'
  },
  {
    id: '5',
    companyName: 'Creative Designs Studio',
    contactName: 'Ravi Desai',
    gstNumber: '24AADCC9876B1ZQ',
    phoneNumber: '+91 8899776655',
    phone: '+91 8899776655',
    email: 'hello@creativedesigns.in',
    bankAccountNumber: '30142536789',
    bankDetails: 'Kotak Mahindra Bank, Branch: Ahmedabad Main, IFSC: KKBK0000958',
    address: '67 Design Hub',
    city: 'Ahmedabad',
    state: 'Gujarat',
    postalCode: '380009',
    website: 'https://creativedesigns.in'
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    clientId: '1',
    date: '2025-04-01',
    dueDate: '2025-04-15',
    invoiceNumber: 'INV-2025-001',
    items: [
      {
        id: '1',
        description: 'Web Development Services',
        quantity: 1,
        hsnCode: '998314',
        rate: 50000,
        gstRate: 18,
        cgstRate: 9,
        sgstRate: 9,
        amount: 50000
      },
      {
        id: '2',
        description: 'SEO Optimization - Monthly Fee',
        quantity: 3,
        hsnCode: '998361',
        rate: 10000,
        gstRate: 18,
        cgstRate: 9,
        sgstRate: 9,
        amount: 30000
      }
    ],
    subtotal: 80000,
    gstAmount: 14400,
    total: 94400,
    status: 'paid'
  },
  {
    id: '2',
    clientId: '3',
    date: '2025-04-03',
    dueDate: '2025-04-17',
    invoiceNumber: 'INV-2025-002',
    items: [
      {
        id: '1',
        description: 'Export Consultation Services',
        quantity: 1,
        hsnCode: '998599',
        rate: 35000,
        gstRate: 18,
        cgstRate: 9,
        sgstRate: 9,
        amount: 35000
      }
    ],
    subtotal: 35000,
    gstAmount: 6300,
    total: 41300,
    status: 'pending'
  },
  {
    id: '3',
    clientId: '2',
    date: '2025-04-05',
    dueDate: '2025-04-19',
    invoiceNumber: 'INV-2025-003',
    items: [
      {
        id: '1',
        description: 'Architectural Design Services',
        quantity: 1,
        hsnCode: '998391',
        rate: 75000,
        gstRate: 18,
        cgstRate: 9,
        sgstRate: 9,
        amount: 75000
      },
      {
        id: '2',
        description: 'Blueprint Copies',
        quantity: 10,
        hsnCode: '998912',
        rate: 500,
        gstRate: 12,
        cgstRate: 6,
        sgstRate: 6,
        amount: 5000
      }
    ],
    subtotal: 80000,
    gstAmount: 14100,
    total: 94100,
    status: 'overdue'
  }
];
