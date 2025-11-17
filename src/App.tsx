import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import { ThemeProvider } from "next-themes";

const Clients = lazy(() => import("./pages/Clients"));
const NewClient = lazy(() => import("./pages/NewClient"));
const Invoices = lazy(() => import("./pages/Invoices"));
const NewInvoice = lazy(() => import("./pages/NewInvoice"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ClientDetails = lazy(() => import("./pages/ClientDetails"));
const InvoiceDetails = lazy(() => import("./pages/InvoiceDetails"));
const AuthPage = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ManageInvoiceStatusPage = lazy(() => import("./pages/ManageInvoiceStatus"));
const Templates = lazy(() => import("./pages/Templates"));
const TemplateDesigner = lazy(() => import("./pages/TemplateDesigner"));
const ProtectedRoute = lazy(() => import("./components/auth/ProtectedRoute"));

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {/* Sonner Toaster can be removed if unused elsewhere */}
        <BrowserRouter>
          <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">Loading…</div>}>
            <Routes>
              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Public Routes - No authentication required */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/clients/new" element={<NewClient />} />
              <Route path="/clients/:id" element={<ClientDetails />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/invoices/new" element={<NewInvoice />} />
              <Route path="/invoices/:id" element={<InvoiceDetails />} />
              <Route path="/manage-invoice-status" element={<ManageInvoiceStatusPage />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/templates/designer" element={<TemplateDesigner />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
