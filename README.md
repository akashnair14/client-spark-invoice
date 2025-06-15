
# SparkInvoice

A modern, full-stack invoice management application for small businesses and freelancers to efficiently manage clients, invoices, and payments.

## Features

- **Client Management:** Quickly add, view, update and list clients.
- **Invoices:** Generate, edit, and export invoices in a professional format, with GST and total calculations.
- **Dashboard:** Interactive dashboard with business statistics, charts, recent activity, and metrics.
- **Authentication:** Secure login/register with optional third-party providers.
- **Dark/Light Mode:** Instantly toggle between dark and light themes.
- **Modern Tech Stack:** Fast, reactive UI using React, Vite, TypeScript, Tailwind CSS, and shadcn/ui components.
- **Responsive Design:** Fully works on mobile, tablet and desktop.
- **PDF Export/Print-ready:** Export or print invoices for sharing and compliance.

## Technologies Used

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS, shadcn/ui
- **Component Library:** Radix UI & Shadcn UI
- **State Management:** @tanstack/react-query (queries, caching), useState, useEffect
- **Data Visualization:** recharts
- **Utility Libraries:** lucid-react (icons), class-variance-authority, clsx, uuid
- **Authentication & Backend:** Supabase (for real deployments – currently mocked)
- **PDF Generation:** jsPDF (for exporting invoices to PDF files)

## Getting Started

1. **Clone this repo:**
   ```sh
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Run the development server:**
   ```sh
   npm run dev
   ```

4. **Open your app:**  
   Visit `http://localhost:8080` in your browser.

## Customization

- You can change theme (dark/light) with the button in the Navbar.
- Update invoice formats and business logic in the `/src/components/invoices/` directory.
- All mock data is in `/src/data/mockData.ts` – replace or connect to your API/Supabase as needed.

## Deployment

- Deploy easily via [Lovable](https://docs.lovable.dev/user-guides/publish) or your favorite hosting provider.
- [Custom Domain setup guide](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide).

## Maintainers
Made with 💙 using [Lovable](https://lovable.dev/).

