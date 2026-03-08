import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ThemeProvider } from "next-themes";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      <span className="text-sm text-muted-foreground">Loading…</span>
    </div>
  </div>
);

const ProtectedPage = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/dashboard" element={<ProtectedPage><Dashboard /></ProtectedPage>} />
                <Route path="/clients" element={<ProtectedPage><Clients /></ProtectedPage>} />
                <Route path="/clients/new" element={<ProtectedPage><NewClient /></ProtectedPage>} />
                <Route path="/clients/:id" element={<ProtectedPage><ClientDetails /></ProtectedPage>} />
                <Route path="/invoices" element={<ProtectedPage><Invoices /></ProtectedPage>} />
                <Route path="/invoices/new" element={<ProtectedPage><NewInvoice /></ProtectedPage>} />
                <Route path="/invoices/:id" element={<ProtectedPage><InvoiceDetails /></ProtectedPage>} />
                <Route path="/manage-invoice-status" element={<ProtectedPage><ManageInvoiceStatusPage /></ProtectedPage>} />
                <Route path="/templates" element={<ProtectedPage><Templates /></ProtectedPage>} />
                <Route path="/templates/designer" element={<ProtectedPage><TemplateDesigner /></ProtectedPage>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
