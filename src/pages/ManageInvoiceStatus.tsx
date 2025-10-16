import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import InvoiceStatusUpdateRow from "@/components/invoices/InvoiceStatusUpdateRow";
import { Invoice, Client } from "@/types";
import { getInvoices, updateInvoiceStatus } from "@/api/invoices";
import { getClients } from "@/api/clients";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import PageSEO from "@/components/seo/PageSEO";

// Using real data from .NET Core backend

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
  const [loading, setLoading] = useState(false);
  
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Record<string, Client>>({});
  const { toast } = useToast();

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [invoicesData, clientsData] = await Promise.all([
          getInvoices(),
          getClients()
        ]);

        // Transform invoices
        const transformedInvoices: Invoice[] = invoicesData.map((i: any) => ({
          id: i.id,
          invoiceNumber: i.invoice_number,
          clientId: i.client_id,
          clientName: i.clients?.company_name || 'Unknown Client',
          date: i.date,
          dueDate: i.due_date,
          amount: Number(i.total),
          status: i.status,
          subtotal: Number(i.subtotal),
          gstAmount: Number(i.gst_amount),
          total: Number(i.total),
          gstType: i.gst_type,
          notes: i.notes,
          lastStatusUpdate: i.last_status_update,
          items: i.invoice_items?.map((item: any) => ({
            id: item.id,
            description: item.description,
            hsnCode: item.hsn_code,
            quantity: Number(item.quantity),
            rate: Number(item.rate),
            gstRate: Number(item.gst_rate),
            cgstRate: Number(item.cgst_rate),
            sgstRate: Number(item.sgst_rate),
            amount: Number(item.amount),
          })) || [],
        }));

        // Transform clients into lookup object
        const clientsLookup: Record<string, Client> = {};
        clientsData.forEach((c: any) => {
          clientsLookup[c.id] = {
            id: c.id,
            companyName: c.company_name,
            contactName: c.contact_name ?? '',
            gstNumber: c.gst_number ?? '',
            phoneNumber: c.phone_number ?? '',
            phone: c.phone_number ?? '',
            email: c.email ?? '',
            bankAccountNumber: c.bank_account_number ?? '',
            bankDetails: c.bank_details ?? '',
            address: c.address ?? '',
            city: c.city ?? '',
            state: c.state ?? '',
            postalCode: c.postal_code ?? '',
            website: c.website ?? '',
            tags: c.tags ?? [],
            status: c.status as any,
          };
        });

        setInvoices(transformedInvoices);
        setClients(clientsLookup);
      } catch (error: any) {
        toast({
          title: 'Error loading data',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
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

  const handleUpdateStatus = async (id: string, newStatus: Invoice["status"]) => {
    try {
      await updateInvoiceStatus(id, newStatus);
      
      setInvoices(prev =>
        prev.map(inv => inv.id === id ? { ...inv, status: newStatus, lastStatusUpdate: new Date().toISOString() } : inv)
      );
      setFilteredInvoices(prev =>
        prev.map(inv => inv.id === id ? { ...inv, status: newStatus, lastStatusUpdate: new Date().toISOString() } : inv)
      );

      toast({
        title: 'Status updated',
        description: `Invoice status changed to ${newStatus}`,
      });
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
    }
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
      <PageSEO
        title="Manage Invoice Status | SparkInvoice"
        description="Search and update invoice statuses easily."
        canonicalUrl={window.location.origin + "/manage-invoice-status"}
      />
      <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
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
          {loading && (
            <div className="text-muted-foreground py-8 text-center">Loading invoices...</div>
          )}
          {!loading && filteredInvoices.length === 0 && (
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
