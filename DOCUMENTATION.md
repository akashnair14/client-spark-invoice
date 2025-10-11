# SparkInvoice – User Documentation

Welcome to **SparkInvoice** – a modern, feature-rich invoice and client management platform. This comprehensive guide will help you master every feature and workflow.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Authentication](#authentication)
3. [Dashboard Overview](#dashboard-overview)
4. [Client Management](#client-management)
5. [Invoice Management](#invoice-management)
6. [Template Designer](#template-designer)
7. [Advanced Features](#advanced-features)
8. [Settings & Preferences](#settings--preferences)
9. [Tips & Best Practices](#tips--best-practices)
10. [FAQ & Troubleshooting](#faq--troubleshooting)

---

## Quick Start

### First Launch

1. **Access the Application**: Navigate to your SparkInvoice URL (default: `http://localhost:5173`)
2. **Create Account**: Click "Sign Up" and register with your email
3. **Verify Email**: Check your email for verification (in development, check Supabase dashboard)
4. **Login**: Use your credentials to access the dashboard
5. **Explore**: The dashboard provides an overview of your business metrics

### Initial Setup

1. **Add Your First Client**
   - Navigate to Clients → New Client
   - Fill in company details, GST number, and contact information
   - Save the client profile

2. **Create Your First Invoice**
   - Navigate to Invoices → New Invoice
   - Select a client from the dropdown
   - Add line items with descriptions, quantities, and rates
   - Preview and save your invoice

---

## Authentication

### Sign Up

- **Email/Password**: Standard registration with email verification
- **Social Login**: Google OAuth (when enabled)
- **Password Requirements**: Minimum 8 characters with complexity requirements

### Login

- **Remember Me**: Stay logged in across sessions
- **Forgot Password**: Reset via email link
- **Session Management**: Automatic token refresh for security

### Security Features

- **Row Level Security**: Your data is isolated from other users
- **Encrypted Storage**: All sensitive data is encrypted
- **Secure Sessions**: Automatic logout after inactivity
- **Role-Based Access**: Admin and user roles supported

---

## Dashboard Overview

The dashboard is your command center for business insights and quick actions.

### Key Metrics

**Business Stats Cards** (Top Row)
- **Total Clients**: Number of active clients (click to view client list)
- **Total Invoices**: All invoices across all statuses (click to view invoice list)
- **Total Earnings**: Sum of all paid invoices
- **Pending Amount**: Outstanding payments from unpaid invoices

All stats are **clickable** – tap any metric to drill down into detailed views.

### Interactive Charts

**Invoice Distribution Chart**
- Bar chart showing invoice counts by client
- Click any bar to view that client's details
- Hover for exact invoice counts
- Updates in real-time as you create invoices

**Revenue Trends** (Future Enhancement)
- Track income over time
- Identify seasonal patterns
- Forecast future revenue

### Quick Access Widgets

**Recent Clients**
- Shows 5 most recently added clients
- Click any client to view full profile
- Quick access to client invoices

**Recent Invoices**
- Latest 5 invoices with status badges
- Color-coded status indicators:
  - 🟢 Paid (green)
  - 🟡 Pending (yellow)
  - 🔴 Overdue (red)
  - ⚪ Draft (gray)
- Click to view invoice details

**Top Clients** (By Revenue)
- Identifies your most valuable clients
- Sorted by total invoice value
- Click to view client details

**Recent Activity Timeline**
- Real-time feed of important events
- Payment confirmations
- Overdue invoice alerts
- New client additions
- Invoice status changes

### Global Search

- **Access**: Search bar in navbar (keyboard shortcut: `/`)
- **Search Across**: Clients and invoices simultaneously
- **Search By**:
  - Client name or company
  - Client email or phone
  - Invoice number
  - Invoice amount
- **Live Results**: Updates as you type
- **Quick Navigation**: Click result to view details

---

## Client Management

### Adding a New Client

**Navigation**: Clients → New Client Button

**Required Fields**:
- Company Name: Legal business name
- GST Number: 15-character GSTIN (validated)
- Phone Number: Primary contact (min. 10 digits)
- Email: Business email address

**Banking Details**:
- Bank Account Number
- Bank Name and Branch
- IFSC Code (optional)

**Address**: Complete business address for invoices

**Validation**:
- Real-time form validation
- Error messages for invalid inputs
- Required field indicators

### Viewing Clients

**Client Table** (Clients Page)
- Sortable columns (name, email, phone, GST number)
- Pagination for large datasets
- Bulk selection checkboxes
- Action buttons per row (View, Edit, Delete)

**Client Details Drawer**
- Slide-out panel showing complete client information
- Recent invoice history
- Quick action buttons (Edit, Create Invoice)
- View without leaving current page

### Client Details Page

**Full Page View** (Click client name)
- Complete client information card
- All associated invoices table
- Invoice creation shortcut
- Edit client button
- Activity history

**Client Invoices Section**:
- Filterable invoice list for this client
- Status-based filtering
- Date range selection
- Export client-specific reports

### Editing Clients

- Update any client field except ID
- Validation ensures data integrity
- Changes reflect immediately across all invoices
- Confirmation required for deletion

### Bulk Operations

Select multiple clients to:
- Export to CSV/Excel
- Delete multiple clients (with confirmation)
- Send batch communications (future)
- Update categories or tags (future)

---

## Invoice Management

### Creating a New Invoice

**Step 1: Select Client**
- Dropdown of all active clients
- Search within dropdown
- Quick add client button

**Step 2: Invoice Details**
- **Invoice Number**: Auto-generated, editable
- **Invoice Date**: Defaults to today, customizable
- **Due Date**: Payment deadline (defaults to 30 days)
- **Reference Number**: Optional PO/reference
- **Status**: Draft, Sent, Pending, Paid, Overdue

**Step 3: Add Line Items**
- Click "Add Item" button
- **Description**: Product/service details
- **HSN/SAC Code**: Tax classification code
- **Quantity**: Number of units
- **Rate**: Unit price
- **GST Rate**: Tax percentage (default: 18%)
  - Automatically splits into CGST (9%) and SGST (9%)
  - Adjustable CGST/SGST for special cases
- **Amount**: Auto-calculated (Quantity × Rate)

**Item Calculations**:
- Base Amount = Quantity × Rate
- GST Amount = Base Amount × GST Rate
- Line Total = Base Amount + GST Amount

**Step 4: Additional Details**
- **Notes**: Terms, payment instructions, disclaimers
- **Footer Text**: Company tagline or legal text
- **Internal Notes**: Private notes (not printed)

**Step 5: Review & Save**
- **Live Preview**: Real-time invoice preview on right side
- **Totals Calculation**:
  - Subtotal: Sum of all item base amounts
  - CGST: Central GST total
  - SGST: State GST total
  - Grand Total: Subtotal + CGST + SGST
- **Save Options**:
  - Save as Draft: Continue editing later
  - Save & Send: Mark as sent
  - Save & Print: Generate PDF immediately

### Invoice Status Workflow

**Status Lifecycle**:
1. **Draft**: Being created, not finalized
2. **Sent**: Delivered to client
3. **Pending**: Awaiting payment
4. **Paid**: Payment received
5. **Overdue**: Past due date without payment

**Status Changes**:
- Automatic: Draft → Pending (on save)
- Automatic: Pending → Overdue (past due date)
- Manual: Mark as Paid
- Manual: Mark as Sent

**Status Actions**:
- Quick status update from invoice list
- Bulk status updates for multiple invoices
- Status change history tracking

### Viewing Invoices

**Invoice List Page**:
- Table view with key details
- Color-coded status badges
- Sortable columns (date, number, amount, status)
- Pagination controls
- Quick actions (View, Edit, Delete, Duplicate)

**Invoice Quick View**:
- Hover preview of invoice details
- View without navigating away
- Quick action buttons

**Invoice Details Page**:
- Full invoice display
- Client information panel
- Detailed line items table
- Total calculation breakdown
- Action buttons (Edit, Print, Export, Share)

### Editing Invoices

- **Edit Mode**: Modify any invoice field
- **Item Management**: Add, remove, or edit line items
- **Recalculation**: Automatic total updates
- **Version History**: Track changes (future)
- **Lock Paid Invoices**: Prevent accidental edits (configurable)

### Invoice Actions

**Print**
- Browser print dialog
- Print-optimized layout
- Header/footer included
- Professional formatting

**Download PDF**
- High-quality PDF generation
- Embedded fonts and graphics
- Email-ready format
- Customizable filename

**Share via WhatsApp**
- One-click WhatsApp sharing
- Pre-filled message template
- Includes invoice number and amount
- Mobile-optimized

**Email Invoice** (Future)
- Send directly from app
- Custom email templates
- Delivery confirmation
- Automated reminders

**Duplicate Invoice**
- Create copy with new number
- Useful for recurring invoices
- Pre-fills all fields
- Edit before saving

### Invoice Filtering & Search

**Filter Options**:
- **Status**: Draft, Sent, Pending, Paid, Overdue
- **Date Range**: Custom date picker
- **Client**: Filter by specific client
- **Amount Range**: Min/max amount filter

**Advanced Search**:
- Full-text search across invoice fields
- Search by invoice number
- Search by client name
- Search by line item descriptions

**Save Filter Presets** (Future):
- Save commonly used filter combinations
- One-click filter application
- Share presets with team

### Bulk Invoice Operations

Select multiple invoices to:
- **Change Status**: Update multiple at once
- **Export**: Generate consolidated reports
- **Print**: Batch print multiple invoices
- **Delete**: Remove multiple (with confirmation)
- **Send Reminders**: Automated email reminders (future)

---

## Template Designer

Create custom invoice layouts with the visual template designer.

### Accessing Template Designer

**Navigation**: Templates → Create Template Button

### Template Library

**Built-in Templates**:
- Professional: Clean, modern layout
- Classic: Traditional invoice design
- Minimal: Simple, elegant format
- Detailed: Comprehensive itemization

**Custom Templates**:
- Create unlimited custom layouts
- Save for reuse
- Set default template
- Organize by category

### Creating a Custom Template

**Step 1: Start New Template**
- Choose blank canvas or base template
- Name your template
- Select paper size (A4 or Letter)
- Choose orientation (Portrait or Landscape)

**Step 2: Design Layout**
- **Drag & Drop Components**:
  - Header Section (company logo, details)
  - Client Information Block
  - Invoice Details (number, date, due date)
  - Line Items Table
  - Totals Section
  - Notes/Terms Section
  - Footer
- **Customize Components**:
  - Font family and size
  - Colors and backgrounds
  - Borders and spacing
  - Column widths
  - Text alignment

**Step 3: Configure Settings**
- **Margins**: Top, bottom, left, right
- **Colors**: Primary, secondary, accent
- **Typography**: Body, heading fonts
- **Branding**: Logo, company colors

**Step 4: Preview & Test**
- Live preview with sample data
- Test print layout
- Verify all fields render correctly
- Check responsive behavior

**Step 5: Save Template**
- Name your template
- Set as default (optional)
- Mark as active
- Categorize for easy finding

### Managing Templates

**Template Actions**:
- **Edit**: Modify existing template
- **Duplicate**: Create variant
- **Set as Default**: Auto-select for new invoices
- **Archive**: Hide without deleting
- **Delete**: Remove permanently

**Template Types**:
- **System**: Built-in, non-editable
- **Custom**: User-created, fully editable
- **Industry**: Pre-made for specific industries (future)

### Using Templates

**Apply to Invoice**:
- Select template during invoice creation
- Change template on existing invoice
- Preview before applying
- Compare templates side-by-side

---

## Advanced Features

### Export & Reporting

**Export Formats**:
- **CSV**: Spreadsheet-compatible data
- **Excel (XLSX)**: Formatted workbooks with formulas
- **PDF**: Professional reports with charts

**Export Options**:
- Client list with contact details
- Invoice register with filters
- Payment history
- Tax reports (GST summary)

**Report Types**:
- Sales summary by period
- Client revenue breakdown
- Tax liability reports
- Aging reports (outstanding invoices)

### Keyboard Shortcuts

**Navigation**:
- `/` : Focus search bar
- `N` : New invoice (from invoices page)
- `C` : New client (from clients page)
- `Esc` : Close modal/drawer

**Actions**:
- `Ctrl/Cmd + S` : Save form
- `Ctrl/Cmd + P` : Print invoice
- `Ctrl/Cmd + E` : Export view
- `?` : Show keyboard shortcuts help

### Responsive Design

**Desktop** (1024px+):
- Full sidebar navigation
- Multi-column layouts
- Large data tables
- Side-by-side forms and previews

**Tablet** (768px - 1023px):
- Collapsible sidebar
- Stacked layouts
- Touch-friendly controls
- Optimized tables

**Mobile** (< 768px):
- Bottom navigation
- Single column layouts
- Swipe gestures
- Mobile-optimized forms

### Dark Mode

**Theme Options**:
- **Light**: Default theme
- **Dark**: OLED-friendly dark theme
- **System**: Match OS preference

**Toggle**: Theme switcher in navbar

**Persistence**: Preference saved to user profile

---

## Settings & Preferences

### Account Settings

**Profile Information**:
- Name and email
- Company details
- Default language
- Time zone

**Security**:
- Change password
- Enable two-factor authentication (future)
- Active sessions
- Login history

### Business Settings

**Company Information**:
- Legal business name
- GST registration number
- Address and contact details
- Bank account information
- Logo upload

**Invoice Defaults**:
- Default payment terms
- Default GST rate
- Invoice number format
- Due date calculation

**Email Settings** (Future):
- SMTP configuration
- Email templates
- Signature
- Automated reminders

### Preferences

**Display**:
- Date format (DD/MM/YYYY or MM/DD/YYYY)
- Number format (decimal places)
- Currency symbol
- Thousand separator

**Notifications**:
- Email notifications
- In-app alerts
- Payment reminders
- Overdue warnings

---

## Tips & Best Practices

### Efficient Invoice Creation

1. **Use Templates**: Set up templates for common invoice types
2. **Client Shortcuts**: Save frequently used line items
3. **Keyboard Navigation**: Learn shortcuts for faster data entry
4. **Batch Processing**: Create multiple invoices for recurring clients

### Data Management

1. **Regular Backups**: Export data monthly (automated backups via Supabase)
2. **Clean Data**: Remove test clients and invoices before production
3. **Categorize Clients**: Use tags for better organization (future)
4. **Archive Old Data**: Keep database lean for better performance

### Professional Invoices

1. **Consistent Branding**: Use your logo and brand colors
2. **Clear Terms**: Include payment terms and due dates
3. **Detailed Descriptions**: Clear line item descriptions
4. **Contact Information**: Easy ways to reach you
5. **Professional Notes**: Thank you messages, disclaimers

### Tax Compliance (India)

1. **Accurate GST Numbers**: Verify client GSTIN before invoicing
2. **HSN Codes**: Use correct codes for products/services
3. **Tax Breakdown**: Show CGST/SGST separately
4. **Invoice Sequence**: Maintain unbroken invoice number sequence
5. **Record Keeping**: Export monthly GST reports

---

## FAQ & Troubleshooting

### General Questions

**Q: Can I use SparkInvoice offline?**
A: No, an internet connection is required. Offline mode is planned for future releases.

**Q: Is my data secure?**
A: Yes, all data is encrypted and protected with Row Level Security in Supabase.

**Q: Can multiple users access the same account?**
A: Currently single-user, but multi-user with role-based permissions is planned.

**Q: What happens to my data if I stop using the service?**
A: You can export all data at any time. Data retention follows our privacy policy.

### Common Issues

**Issue: Invoice totals not calculating**
- Solution: Ensure all line items have valid quantities and rates
- Check that GST rates are numeric values
- Try refreshing the page

**Issue: PDF export showing blank pages**
- Solution: Wait for invoice preview to fully load before exporting
- Check browser compatibility (Chrome recommended)
- Clear browser cache

**Issue: Client list not loading**
- Solution: Check internet connection
- Refresh the page
- Check browser console for errors
- Verify Supabase connection

**Issue: Template changes not saving**
- Solution: Ensure you're logged in
- Check if template name is unique
- Verify you have edit permissions
- Try saving with a different name

### Performance Tips

**Slow Loading**:
- Clear browser cache
- Use modern browser (Chrome, Firefox, Edge)
- Check internet connection speed
- Reduce number of simultaneous operations

**Large Datasets**:
- Use filtering instead of viewing all records
- Export and archive old data
- Use pagination controls
- Search instead of scrolling

### Getting Help

**Support Channels**:
1. Check this documentation
2. Review FAQ section
3. Search GitHub issues
4. Open new issue with details
5. Contact support team

**When Reporting Issues**:
- Describe steps to reproduce
- Include screenshots if possible
- Note browser and OS versions
- Provide error messages
- Check browser console for errors

---

## Keyboard Shortcuts Reference

### Global
- `/` : Focus search
- `Esc` : Close modal/drawer
- `?` : Help menu

### Navigation
- `G` then `D` : Go to Dashboard
- `G` then `C` : Go to Clients
- `G` then `I` : Go to Invoices
- `G` then `T` : Go to Templates

### Actions
- `N` : New (context-dependent)
- `E` : Edit current item
- `S` : Save form
- `P` : Print
- `X` : Export

### Lists
- `↑` / `↓` : Navigate items
- `Enter` : Open selected item
- `Delete` : Delete selected item
- `Space` : Select/deselect item

---

## Updates & New Features

Check the [Feature Roadmap](FEATURE_ROADMAP.md) for planned enhancements.

Recent updates include:
- Custom template designer
- Bulk operations
- WhatsApp sharing
- Advanced filtering
- Dark mode support

---

## Glossary

**CGST**: Central Goods and Services Tax (India)
**SGST**: State Goods and Services Tax (India)
**HSN**: Harmonized System of Nomenclature (product classification)
**GSTIN**: Goods and Services Tax Identification Number
**RLS**: Row Level Security (database security)
**PDF**: Portable Document Format
**CSV**: Comma-Separated Values

---

**Enjoy running your business smarter with SparkInvoice!** ⚡

For technical documentation, see the main [README.md](README.md)
