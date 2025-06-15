
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import InvoiceStatusUpdateRow from "@/components/invoices/InvoiceStatusUpdateRow";
import { Invoice, Client } from "@/types";
import { mockClients } from "@/data/mockData";
import { format } from "date-fns";

// MOCK DATA: Replace with actual query in production
const mockInvoices: Invoice[] = [
  {
    id: "1",
    clientId: "1",
    date: "2024-01-15",
    dueDate: "2024-02-14",
    invoiceNumber: "INV-2024-001",
    items: [],
    subtotal: 50000,
    gstAmount: 9000,
    total: 59000,
    status: "paid",
    notes: "Thank you for your business!",
    gstType: "regular",
    lastStatusUpdate: "2024-01-20",
  },
  {
    id: "2",
    clientId: "2",
    date: "2024-01-20",
    dueDate: "2024-02-19",
    invoiceNumber: "INV-2024-002",
    items: [],
    subtotal: 75000,
    gstAmount: 13500,
    total: 88500,
    status: "pending",
    notes: "",
    gstType: "igst",
    lastStatusUpdate: "2024-01-20",
  },
  {
    id: "3",
    clientId: "3",
    date: "2023-12-10",
    dueDate: "2024-01-09",
    invoiceNumber: "INV-2023-025",
    items: [],
    subtotal: 30000,
    gstAmount: 5400,
    total: 35400,
    status: "overdue",
    notes: "First invoice for new client",
    gstType: "regular",
    lastStatusUpdate: "2023-12-10",
  },
];

const statusOrder = ["draft", "sent", "pending", "overdue", "paid"];

const getNextStatusOptions = (status: Invoice["status"]) => {
  // Only valid transitions: allow to change among pending↔overdue↔paid, but not to draft/sent in this interface
  if (status === "paid") return ["pending", "overdue"];
  if (status === "pending") return ["paid", "overdue"];
  if (status === "overdue") return ["pending", "paid"];
  return []; // Shouldn't be possible for draft/sent here
};

const ManageInvoiceStatusPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [showPaidPrompt, setShowPaidPrompt] = useState<{show: boolean, invoice: Invoice|null}>({show: false, invoice: null});
  const [overridePaid, setOverridePaid] = useState(false);

  // We use mock data here for demo
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const clients = useMemo(() => {
    return mockClients.reduce((acc, client) => {
      acc[client.id] = client;
      return acc;
    }, {} as Record<string, Client>);
  }, []);

  const handleSearch = () => {
    const query = search.trim().toLowerCase();
    if (!query) {
      setFilteredInvoices([]);
      return;
    }
    // Search by invoice number, client, or status
    let matches = invoices.filter(inv =>
      inv.invoiceNumber.toLowerCase().includes(query) ||
      clients[inv.clientId]?.companyName?.toLowerCase()?.includes(query) ||
      (inv.status && inv.status.includes(query))
    );

    // if "paid" is in query, trigger popup confirmation when matching paid invoices
    if (matches.some((inv) => inv.status === "paid" && !overridePaid)) {
      const paid = matches.find((inv) => inv.status === "paid");
      setShowPaidPrompt({show: true, invoice: paid||null});
      setFilteredInvoices([]);
      return;
    }
    // Default: skip showing paid invoices unless overridePaid is true
    if (!overridePaid) matches = matches.filter((inv) => inv.status !== "paid");
    setFilteredInvoices(matches);
  };

  const handleUpdateStatus = (id: string, newStatus: Invoice["status"]) => {
    setInvoices(prev =>
      prev.map(inv => inv.id === id ? { ...inv, status: newStatus, lastStatusUpdate: new Date().toISOString() } : inv)
    );
    setFilteredInvoices(prev =>
      prev.map(inv => inv.id === id ? { ...inv, status: newStatus, lastStatusUpdate: new Date().toISOString() } : inv)
    );
  };

  // If overriding, set so and re-run search
  const handlePaidPromptConfirm = () => {
    setShowPaidPrompt({show: false, invoice: null});
    setOverridePaid(true);
    setTimeout(handleSearch, 100);
  };
  const handlePaidPromptCancel = () => {
    setShowPaidPrompt({show: false, invoice: null});
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <h1 className="page-title">Manage Invoice Status</h1>
        <p className="page-description">Search for invoices and update their status easily. Only invoices with unpaid or overdue status are shown by default.</p>
        <div className="flex gap-2 max-w-lg">
          <Input
            placeholder="Search by invoice #, client, or status…"
            value={search}
            onChange={(e) => { 
              setSearch(e.target.value); 
              setOverridePaid(false);
            }}
            className="flex-1"
            onKeyDown={e => { if (e.key === "Enter") handleSearch(); }}
            aria-label="Search for invoices"
            data-testid="search-input"
          />
          <Button onClick={handleSearch} data-testid="search-btn">Search</Button>
        </div>
        <div>
          {filteredInvoices.length === 0 && (
            <div className="text-muted-foreground py-8 text-center">No invoices found or no search performed.</div>
          )}
          <div className="flex flex-col gap-3">
            {filteredInvoices.map(inv => (
              <InvoiceStatusUpdateRow
                key={inv.id}
                invoice={inv}
                client={clients[inv.clientId]}
                onUpdate={handleUpdateStatus}
              />
            ))}
          </div>
        </div>
        {/* Paid invoice confirmation dialog */}
        <Dialog open={showPaidPrompt.show} onOpenChange={handlePaidPromptCancel}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>The invoice bill has already been paid</DialogTitle>
            </DialogHeader>
            <div>
              <p>
                <span className="font-bold">{showPaidPrompt.invoice?.invoiceNumber}</span> billed for <span className="font-bold">{clients[showPaidPrompt.invoice?.clientId||""]?.companyName}</span> is marked as <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Paid</Badge>.<br />
                Do you want to change its status?
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handlePaidPromptCancel}>No</Button>
              <Button onClick={handlePaidPromptConfirm}>Yes, show the record</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ManageInvoiceStatusPage;
