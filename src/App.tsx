import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Clients from "./pages/Clients";
import NewClient from "./pages/NewClient";
import Invoices from "./pages/Invoices";
import NewInvoice from "./pages/NewInvoice";
import NotFound from "./pages/NotFound";
import ClientDetails from "./pages/ClientDetails";
import InvoiceDetails from "./pages/InvoiceDetails";
import AuthPage from "./pages/Auth";
import { useAuth } from "@/hooks/useAuth";
import Dashboard from "./pages/Dashboard";
import { ThemeProvider } from "next-themes";
import ManageInvoiceStatusPage from "./pages/ManageInvoiceStatus";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {/* Sonner Toaster can be removed if unused elsewhere */}
        <BrowserRouter>
          <Routes>
            {/* Redirect / to /dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/new" element={<NewClient />} />
            <Route path="/clients/:id" element={<ClientDetails />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/invoices/new" element={<NewInvoice />} />
            <Route path="/invoices/:id" element={<InvoiceDetails />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/manage-invoice-status" element={<ManageInvoiceStatusPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
