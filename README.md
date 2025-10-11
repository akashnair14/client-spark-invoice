# SparkInvoice

A modern, full-stack invoice management application built with React, TypeScript, Vite, Tailwind CSS, and Supabase.

## 🚀 Features

### Client Management
- **Comprehensive Client Profiles**: Store company details, GST number, contact information, and banking details
- **Client Dashboard**: Advanced search and filtering capabilities
- **Client Activity Tracking**: Monitor invoice history and payment status per client
- **Bulk Operations**: Perform actions on multiple clients simultaneously
- **Quick Access Drawer**: View client details without leaving the current page

### Invoice Management
- **Professional Invoice Generation**: Line items, GST calculations (CGST/SGST), HSN codes, automatic totaling
- **Multiple Invoice Templates**: Design custom invoice layouts with drag-and-drop template designer
- **Invoice Status Workflow**: Draft, Sent, Pending, Paid, and Overdue statuses
- **PDF Export & Print**: Generate professional PDF invoices
- **WhatsApp Sharing**: Share invoices via WhatsApp with one click
- **Bulk Actions**: Manage multiple invoices at once
- **Invoice Preview**: Real-time preview as you create

### Template System
- **Custom Template Designer**: Visual drag-and-drop editor for invoice layouts
- **Template Library**: Save and reuse custom templates
- **Default Templates**: Set default templates for quick invoice creation
- **Multi-format Support**: A4 and Letter paper sizes

### Dashboard & Analytics
- **Business Overview**: Real-time metrics on clients, invoices, and revenue
- **Interactive Charts**: Visual invoice distribution and trends
- **Recent Activity**: Timeline of recent actions
- **Top Clients**: Identify most valuable clients

### Advanced Features
- **Dark Mode Support**: Full theme support with system preference detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Global Search**: Search across clients and invoices
- **Smart Filtering**: Advanced filter combinations
- **Export Options**: CSV, XLSX, and PDF formats
- **Real-time Updates**: Instant data synchronization
- **Keyboard Shortcuts**: Quick navigation

## 🛠️ Tech Stack

### Frontend
- **React 18.3** with TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Styling with custom design system
- **Shadcn/ui** - Component library
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Recharts** - Data visualization
- **jsPDF** - PDF generation

### Backend & Database
- **Supabase** - PostgreSQL database
- **Supabase Auth** - Authentication
- **Row Level Security** - Database-level security
- **Real-time Subscriptions** - Live data updates

## 📁 Project Structure

```
src/
├── api/                    # API client functions
├── components/            # React components
│   ├── auth/             # Authentication
│   ├── clients/          # Client management
│   ├── dashboard/        # Dashboard widgets
│   ├── invoices/         # Invoice components
│   ├── layout/          # App layout
│   ├── templates/       # Template designer
│   └── ui/              # Shadcn UI components
├── hooks/                # Custom React hooks
├── pages/                # Page components (routes)
├── types/                # TypeScript definitions
└── utils/                # Utility functions
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sparkinvoice
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   The project is pre-configured with Supabase. Environment variables are already set in the integration.

4. **Run the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## 🎨 Design System

The application uses a comprehensive design system with:
- Semantic color variables (HSL)
- Dark mode support
- Consistent spacing and typography
- Smooth transitions and animations
- Accessible components

## 🔐 Authentication

- Email/password authentication
- Protected routes
- Role-based access control
- Secure session management
- Row Level Security policies

## 📊 Database Schema

- **clients**: Company details and contact information
- **invoices**: Invoice data with status tracking
- **invoice_items**: Line items with GST calculations
- **invoice_templates**: Custom invoice layouts
- **user_roles**: User role management

## 📝 Documentation

- **User Guide**: See `DOCUMENTATION.md` for detailed feature documentation
- **Feature Roadmap**: See `FEATURE_ROADMAP.md` for planned features
- **Production Checklist**: See `PRODUCTION_CHECKLIST.md` for deployment checklist

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.app)
- UI components from [Shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
- Backend powered by [Supabase](https://supabase.com)

---

**SparkInvoice** - Modern invoicing made simple ⚡
