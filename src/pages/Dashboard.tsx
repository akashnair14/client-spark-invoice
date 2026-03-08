import React, { useMemo, useState } from "react";
import Layout from "@/components/layout/Layout";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import RecentClients from "@/components/dashboard/RecentClients";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Users, Bell, RefreshCw, TrendingUp, TrendingDown, Search, X, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Client, Invoice } from "@/types";
import PageSEO from "@/components/seo/PageSEO";
import { cn } from "@/lib/utils";

const getTopClients = (clients: Client[], invoices: Invoice[], n = 3) => {
  const totals: Record<string, { name: string; sum: number }> = {};
  invoices.forEach((inv) => {
    if (!totals[inv.clientId]) {
      const client = clients.find((c) => c.id === inv.clientId);
      totals[inv.clientId] = { name: client?.companyName || inv.clientName, sum: 0 };
    }
    totals[inv.clientId].sum += inv.amount;
  });
  return Object.entries(totals)
    .sort((a, b) => b[1].sum - a[1].sum)
    .slice(0, n)
    .map(([cid, v]) => ({ clientId: cid, ...v }));
};

const generateNotifications = (invoices: Invoice[]) => {
  const notifications: { id: number; text: string; type: "destructive" | "warning" | "success" }[] = [];
  const overdueCount = invoices.filter((inv) => inv.status === "overdue").length;
  if (overdueCount > 0) notifications.push({ id: 1, text: `${overdueCount} overdue invoice${overdueCount > 1 ? "s" : ""}`, type: "destructive" });
  const draftCount = invoices.filter((inv) => inv.status === "draft").length;
  if (draftCount > 0) notifications.push({ id: 2, text: `${draftCount} draft${draftCount > 1 ? "s" : ""} pending`, type: "warning" });
  const paidCount = invoices.filter((inv) => inv.status === "paid").length;
  if (paidCount > 0) notifications.push({ id: 3, text: `${paidCount} paid`, type: "success" });
  return notifications;
};

const Dashboard: React.FC = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { clients, invoices, loading, error, refetch } = useDashboardData();

  const filteredClients = useMemo(() => {
    if (!search.trim()) return clients;
    return clients.filter(
      (c) =>
        c.companyName?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, clients]);

  const filteredInvoices = useMemo(() => {
    if (!search.trim()) return invoices;
    return invoices.filter(
      (i) =>
        i.clientName?.toLowerCase().includes(search.toLowerCase()) ||
        i.invoiceNumber?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, invoices]);

  const topClients = useMemo(() => getTopClients(filteredClients, filteredInvoices), [filteredClients, filteredInvoices]);
  const notifications = useMemo(() => generateNotifications(filteredInvoices), [filteredInvoices]);

  const paidAmount = filteredInvoices.reduce((sum, inv) => (inv.status === "paid" ? sum + inv.amount : sum), 0);
  const pendingAmount = filteredInvoices.reduce((sum, inv) => (inv.status === "pending" ? sum + inv.amount : sum), 0);
  const overdueAmount = filteredInvoices.reduce((sum, inv) => (inv.status === "overdue" ? sum + inv.amount : sum), 0);
  const hasData = filteredClients.length > 0 || filteredInvoices.length > 0;

  return (
    <Layout>
      <PageSEO
        title="Dashboard | SparkInvoice"
        description="View key metrics, recent activity, clients and invoices."
        canonicalUrl={window.location.origin + "/dashboard"}
      />
      <div className="pb-4 space-y-5 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between animate-fade-in">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              Your business at a glance
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => navigate("/invoices/new")} className="gap-1.5">
              <Plus className="w-4 h-4" /> Invoice
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigate("/clients/new")} className="gap-1.5">
              <Plus className="w-4 h-4" /> Client
            </Button>
            <Button size="icon" variant="ghost" onClick={refetch} disabled={loading} className="h-9 w-9">
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </Button>
          </div>
        </div>

        {/* Notifications */}
        {!loading && notifications.length > 0 && (
          <div className="flex flex-wrap gap-2 animate-fade-in stagger-2">
            {notifications.map((n) => (
              <Badge
                key={n.id}
                variant={n.type === "destructive" ? "destructive" : n.type === "warning" ? "warning" : "success"}
                className="text-xs py-1 px-2.5 gap-1.5"
              >
                <span className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  n.type === "destructive" && "bg-destructive",
                  n.type === "warning" && "bg-warning",
                  n.type === "success" && "bg-success"
                )} />
                {n.text}
              </Badge>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <Card className="border-destructive/40 bg-destructive/5">
            <CardContent className="p-4 flex items-center justify-between">
              <p className="text-sm text-destructive font-medium">Error: {error}</p>
              <Button variant="outline" size="sm" onClick={refetch}><RefreshCw className="w-3 h-3 mr-1" />Retry</Button>
            </CardContent>
          </Card>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
          </div>
        )}

        {/* Search */}
        {!loading && (
          <div className="relative max-w-md animate-fade-in stagger-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clients, invoices…"
              className="pl-10 pr-8 h-10 bg-surface-1"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
              </button>
            )}
          </div>
        )}

        {!loading && !hasData && (
          <div className="flex flex-col items-center py-20 animate-fade-in">
            <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-1.5">No data yet</h2>
            <p className="text-sm text-muted-foreground mb-5">Start by adding a client or creating an invoice.</p>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => navigate("/clients/new")}><Users className="w-4 h-4 mr-1" /> Add Client</Button>
              <Button size="sm" variant="outline" onClick={() => navigate("/invoices/new")} disabled={clients.length === 0} title={clients.length === 0 ? "Add a client first" : ""}><FileText className="w-4 h-4 mr-1" /> New Invoice</Button>
            </div>
          </div>
        )}

        {!loading && hasData && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <DashboardStats clients={filteredClients} invoices={filteredInvoices} />
            </div>

            {/* Revenue Summary - Asymmetric layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <Card className="md:col-span-1 border-0 bg-gradient-to-br from-success/8 to-success/3 overflow-hidden relative group hover:shadow-elevated-lg transition-all duration-300">
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-lg bg-success/15 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-success" />
                    </div>
                    <span className="text-xs font-semibold text-success uppercase tracking-wider">Collected</span>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">₹{paidAmount.toLocaleString("en-IN")}</p>
                </CardContent>
              </Card>
              <Card className="border-0 bg-gradient-to-br from-warning/8 to-warning/3 overflow-hidden group hover:shadow-elevated-lg transition-all duration-300">
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-lg bg-warning/15 flex items-center justify-center">
                      <Bell className="h-4 w-4 text-warning" />
                    </div>
                    <span className="text-xs font-semibold text-warning uppercase tracking-wider">Pending</span>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">₹{pendingAmount.toLocaleString("en-IN")}</p>
                </CardContent>
              </Card>
              <Card className="border-0 bg-gradient-to-br from-destructive/8 to-destructive/3 overflow-hidden group hover:shadow-elevated-lg transition-all duration-300">
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-lg bg-destructive/15 flex items-center justify-center">
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    </div>
                    <span className="text-xs font-semibold text-destructive uppercase tracking-wider">Overdue</span>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">₹{overdueAmount.toLocaleString("en-IN")}</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Recent Clients */}
              <Card className="border-border/40">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-semibold">Recent Clients</CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary gap-1" onClick={() => navigate("/clients")}>
                    View All <ArrowUpRight className="h-3 w-3" />
                  </Button>
                </CardHeader>
                <CardContent className="pt-0 space-y-1">
                  {filteredClients.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No clients found.</p>
                  ) : (
                    filteredClients.slice(0, 5).map((client, idx) => (
                      <div
                        key={client.id}
                        className={cn(
                          "flex items-center justify-between p-2.5 rounded-lg hover:bg-accent/50 cursor-pointer transition-all duration-150 animate-fade-in",
                          `stagger-${idx + 1}`
                        )}
                        onClick={() => navigate(`/clients/${client.id}`)}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-primary">
                              {client.companyName?.charAt(0) || "?"}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">{client.companyName}</p>
                            <p className="text-xs text-muted-foreground truncate">{client.email || client.phone || "—"}</p>
                          </div>
                        </div>
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 ml-2" />
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Recent Invoices */}
              <Card className="border-border/40">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-semibold">Recent Invoices</CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary gap-1" onClick={() => navigate("/invoices")}>
                    View All <ArrowUpRight className="h-3 w-3" />
                  </Button>
                </CardHeader>
                <CardContent className="pt-0 space-y-1">
                  {filteredInvoices.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No invoices found.</p>
                  ) : (
                    filteredInvoices.slice(0, 5).map((inv, idx) => (
                      <div
                        key={inv.id}
                        className={cn(
                          "flex items-center justify-between p-2.5 rounded-lg hover:bg-accent/50 cursor-pointer transition-all duration-150 animate-fade-in",
                          `stagger-${idx + 1}`
                        )}
                        onClick={() => navigate(`/invoices/${inv.id}`)}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold truncate">{inv.clientName}</p>
                          <p className="text-xs text-muted-foreground">{inv.invoiceNumber || inv.id?.slice(0, 8)}</p>
                        </div>
                        <div className="flex items-center gap-2.5 flex-shrink-0 ml-2">
                          <span className="text-sm font-bold tabular-nums">₹{inv.amount?.toLocaleString("en-IN")}</span>
                          <Badge
                            variant={
                              inv.status === "paid" ? "success" :
                              inv.status === "pending" ? "warning" :
                              inv.status === "overdue" ? "destructive" :
                              inv.status === "sent" ? "info" : "secondary"
                            }
                            className="text-[10px] px-1.5 py-0"
                          >
                            {inv.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Top clients */}
            {topClients.length > 0 && (
              <Card className="border-border/40">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Top Clients by Revenue</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {topClients.map((c, i) => {
                      const maxSum = topClients[0]?.sum || 1;
                      const pct = Math.round((c.sum / maxSum) * 100);
                      return (
                        <div
                          key={c.clientId}
                          className="cursor-pointer hover:bg-accent/30 rounded-lg p-2.5 transition-all duration-150"
                          onClick={() => navigate(`/clients/${c.clientId}`)}
                        >
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="font-semibold">{i + 1}. {c.name}</span>
                            <span className="font-bold text-primary tabular-nums">₹{c.sum?.toLocaleString("en-IN")}</span>
                          </div>
                          <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div className="xl:col-span-2">
                <DashboardCharts clients={filteredClients} invoices={filteredInvoices} />
              </div>
              <div>
                <RecentClients clients={filteredClients} />
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
