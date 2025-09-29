
# SparkInvoice

A modern, full-stack invoice management application built with React, TypeScript, and Supabase. Designed for small businesses and freelancers to efficiently manage clients, invoices, and payments with a beautiful, responsive interface.

## ✨ Key Features

### 📊 Interactive Dashboard
- Real-time business metrics and statistics
- Clickable widgets for quick navigation
- Global search functionality for clients and invoices
- Top performing clients showcase
- Recent activity feed with visual indicators
- Overdue invoice highlights
- Interactive charts powered by Recharts

### 👥 Client Management
- Complete CRUD operations for client records
- Bulk actions support (select, export, delete)
- Advanced filtering and search capabilities
- Client details drawer with invoice history
- Tags and status management
- Comprehensive client profiles with contact info, GST details, and banking information

### 🧾 Invoice Management
- Professional invoice generation with GST calculations
- Multiple invoice statuses (draft, sent, paid, pending, overdue)
- Bulk operations (status updates, deletion, export)
- Advanced filtering (status, date range, client, FY)
- Quick view panel for rapid invoice review
- PDF export and print functionality
- Support for CGST/SGST and IGST
- Additional details (PO number, DC number, Challan, E-way bill)
- Customizable invoice templates

### 🎨 Template Designer
- Drag-and-drop invoice template builder
- Live preview with real-time updates
- Component palette with pre-built elements
- Property panel for fine-tuning styles
- Save and reuse custom templates
- Paper size and orientation options
- Custom margins and branding support

### 🔐 Authentication
- Secure user authentication via Supabase Auth
- Email/password registration and login
- Row Level Security (RLS) policies for data protection
- User-specific data isolation

### 🎨 Modern UI/UX
- Dark/Light mode toggle with system preference detection
- Smooth animations and transitions
- Fully responsive design (mobile, tablet, desktop)
- shadcn/ui component library
- Consistent design system with semantic color tokens
- Accessible components built on Radix UI

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS with custom design tokens
- **UI Components:** shadcn/ui (Radix UI primitives)
- **State Management:** React Query (@tanstack/react-query)
- **Routing:** React Router v6
- **Forms:** React Hook Form with Zod validation
- **Charts:** Recharts
- **Icons:** Lucide React
- **Drag & Drop:** @dnd-kit
- **Date Handling:** date-fns
- **PDF Generation:** jsPDF

### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Real-time:** Supabase Realtime
- **Storage:** Supabase Storage (planned)
- **API:** Supabase REST API with auto-generated TypeScript types

### Development
- **TypeScript:** Strict type checking
- **ESLint:** Code linting
- **PostCSS:** CSS processing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm/bun
- Supabase account (free tier available)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <YOUR_GIT_URL>
   cd sparkinvoice
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   The project uses Lovable Cloud with Supabase. Environment variables are pre-configured:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

## 📁 Project Structure

```
src/
├── api/                    # API client functions
│   ├── clients.ts         # Client CRUD operations
│   ├── invoices.ts        # Invoice operations
│   └── invoiceTemplates.ts # Template operations
├── components/
│   ├── auth/              # Authentication components
│   ├── clients/           # Client management UI
│   ├── dashboard/         # Dashboard widgets
│   ├── invoices/          # Invoice components
│   │   ├── form/         # Invoice form components
│   │   ├── preview/      # Invoice preview/PDF
│   │   └── template/     # Template system
│   ├── layout/           # Layout components (Navbar, Sidebar)
│   ├── seo/              # SEO components
│   ├── templates/        # Template designer
│   └── ui/               # shadcn/ui components
├── context/              # React Context providers
├── hooks/                # Custom React hooks
├── integrations/         # External integrations
│   └── supabase/        # Supabase client & types
├── lib/                  # Utility functions
├── pages/                # Route pages
├── schemas/              # Zod validation schemas
├── styles/               # Global styles & animations
├── types/                # TypeScript type definitions
└── utils/                # Helper utilities
```

## 🎨 Design System

The application uses a semantic design system with HSL color tokens defined in:
- `src/index.css` - CSS custom properties
- `tailwind.config.ts` - Tailwind theme configuration

### Color Tokens
- `--primary` - Brand primary color
- `--secondary` - Secondary actions
- `--accent` - Accent highlights
- `--destructive` - Error/delete actions
- `--muted` - Subtle backgrounds
- `--border` - Border colors

### Animations
Pre-built animation utilities in `src/styles/animations.css`:
- `animate-fade-in` - Fade in with slide up
- `animate-scale-in` - Scale entrance
- `animate-enter` - Combined fade + scale
- `hover-scale` - Hover scale effect

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- User-scoped data access
- Secure authentication via Supabase Auth
- SQL injection protection via parameterized queries
- Input validation with Zod schemas

## 📖 Usage Guide

### Dashboard
- All widgets are clickable for quick navigation
- Use the global search bar to find clients or invoices instantly
- View top performing clients and recent activity
- Monitor overdue invoices with visual highlights

### Client Management
1. Navigate to **Clients** page
2. Click **Add Client** to create new client records
3. Use filters to search by name, status, or tags
4. Select multiple clients for bulk operations
5. Click on client name to view detailed information

### Invoice Creation
1. Navigate to **Invoices** → **Create Invoice**
2. Select a client from the dropdown
3. Add invoice items with descriptions, HSN codes, quantities, and rates
4. GST is calculated automatically based on item rates
5. Add additional details (PO number, challan, etc.) as needed
6. Preview invoice before saving
7. Export as PDF or print directly

### Template Designer
1. Navigate to **Templates** page
2. Create new template or edit existing ones
3. Drag components from the palette onto the canvas
4. Customize styles, positions, and properties
5. Save template for future invoices

## 🚀 Deployment

### Lovable Platform (Recommended)
- One-click deployment via [Lovable](https://docs.lovable.dev/user-guides/publish)
- Automatic SSL certificates
- Built-in CDN
- [Custom domain setup guide](https://docs.lovable.dev/tips-tricks/custom-domain)

### Manual Deployment
The built application can be deployed to any static hosting service:
- Vercel
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront
- GitHub Pages

**Build Command:** `npm run build`  
**Output Directory:** `dist`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is created with [Lovable](https://lovable.dev/) and is available for use under standard terms.

## 📚 Documentation

For detailed documentation, see:
- [DOCUMENTATION.md](./DOCUMENTATION.md) - Complete usage guide and workflows
- [FEATURE_ROADMAP.md](./FEATURE_ROADMAP.md) - Planned features and enhancements
- [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) - Pre-deployment checklist

## 💙 Built With Lovable

Made with [Lovable](https://lovable.dev/) - The AI-powered web app builder
