import React, { useMemo, useState } from "react";
import Layout from "@/components/layout/Layout";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import RecentClients from "@/components/dashboard/RecentClients";
import RecentInvoices from "@/components/dashboard/RecentInvoices";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Users, Bell, RefreshCw, TrendingUp, TrendingDown, Search, X } from "lucide-react";
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
      <div className="pb-4 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Your business at a glance
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => navigate("/invoices/new")} className="gap-1.5 shadow-sm">
              <Plus className="w-4 h-4" /> Invoice
            </Button>
            <Button size="sm" variant="secondary" onClick={() => navigate("/clients/new")} className="gap-1.5">
              <Plus className="w-4 h-4" /> Client
            </Button>
            <Button size="icon" variant="ghost" onClick={refetch} disabled={loading} className="h-8 w-8">
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </Button>
          </div>
        </div>

        {/* Notifications */}
        {!loading && notifications.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {notifications.map((n) => (
              <Badge
                key={n.id}
                variant={n.type === "destructive" ? "destructive" : n.type === "warning" ? "secondary" : "default"}
                className={cn(
                  "text-xs py-1 px-2.5 gap-1",
                  n.type === "success" && "bg-success/15 text-success border-success/30 hover:bg-success/20",
                  n.type === "warning" && "bg-warning/15 text-warning border-warning/30 hover:bg-warning/20",
                  n.type === "destructive" && "bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/20"
                )}
              >
                <Bell className="w-3 h-3" />
                {n.text}
              </Badge>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="p-4 flex items-center justify-between">
              <p className="text-sm text-destructive">Error: {error}</p>
              <Button variant="outline" size="sm" onClick={refetch}><RefreshCw className="w-3 h-3 mr-1" />Retry</Button>
            </CardContent>
          </Card>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
        )}

        {/* Search */}
        {!loading && (
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clients, invoices…"
              className="pl-9 pr-8 h-9 bg-card"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
        )}

        {!loading && !hasData && (
          <div className="flex flex-col items-center py-16">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileText className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold mb-1">No data yet</h2>
            <p className="text-sm text-muted-foreground mb-4">Start by adding a client or creating an invoice.</p>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => navigate("/clients/new")}><Users className="w-4 h-4 mr-1" /> Add Client</Button>
              <Button size="sm" variant="secondary" onClick={() => navigate("/invoices/new")}><FileText className="w-4 h-4 mr-1" /> New Invoice</Button>
            </div>
          </div>
        )}

        {!loading && hasData && (
          <>
            {/* Stats Grid - 2 cols on mobile, 4 on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <DashboardStats clients={filteredClients} invoices={filteredInvoices} />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="border-0 shadow-sm bg-gradient-to-br from-success/10 to-success/5">
                <CardContent className="p-3 md:p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="h-3.5 w-3.5 text-success" />
                    <span className="text-xs font-medium text-success">Paid</span>
                  </div>
                  <p className="text-base md:text-lg font-bold text-foreground">₹{paidAmount.toLocaleString("en-IN")}</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm bg-gradient-to-br from-warning/10 to-warning/5">
                <CardContent className="p-3 md:p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Bell className="h-3.5 w-3.5 text-warning" />
                    <span className="text-xs font-medium text-warning">Pending</span>
                  </div>
                  <p className="text-base md:text-lg font-bold text-foreground">₹{pendingAmount.toLocaleString("en-IN")}</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm bg-gradient-to-br from-destructive/10 to-destructive/5">
                <CardContent className="p-3 md:p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                    <span className="text-xs font-medium text-destructive">Overdue</span>
                  </div>
                  <p className="text-base md:text-lg font-bold text-foreground">₹{overdueAmount.toLocaleString("en-IN")}</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent data - cards on mobile, table on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Recent Clients */}
              <Card className="shadow-sm border-0">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-semibold">Recent Clients</CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate("/clients")}>View All</Button>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  {filteredClients.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No clients found.</p>
                  ) : (
                    filteredClients.slice(0, 5).map((client) => (
                      <div
                        key={client.id}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                        onClick={() => navigate(`/clients/${client.id}`)}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-primary">
                              {client.companyName?.charAt(0) || "?"}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{client.companyName}</p>
                            <p className="text-xs text-muted-foreground truncate">{client.email || client.phone || "—"}</p>
                          </div>
                        </div>
                        <span className="text-xs text-primary font-medium flex-shrink-0 ml-2">View →</span>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Recent Invoices */}
              <Card className="shadow-sm border-0">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-semibold">Recent Invoices</CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate("/invoices")}>View All</Button>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  {filteredInvoices.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No invoices found.</p>
                  ) : (
                    filteredInvoices.slice(0, 5).map((inv) => (
                      <div
                        key={inv.id}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                        onClick={() => navigate(`/invoices/${inv.id}`)}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{inv.clientName}</p>
                          <p className="text-xs text-muted-foreground">{inv.invoiceNumber || inv.id?.slice(0, 8)}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          <span className="text-sm font-semibold">₹{inv.amount?.toLocaleString("en-IN")}</span>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-[10px] px-1.5 py-0",
                              inv.status === "paid" && "bg-success/15 text-success",
                              inv.status === "pending" && "bg-warning/15 text-warning",
                              inv.status === "overdue" && "bg-destructive/15 text-destructive",
                              inv.status === "draft" && "bg-muted text-muted-foreground",
                              inv.status === "sent" && "bg-info/15 text-info"
                            )}
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
              <Card className="shadow-sm border-0">
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
                          className="cursor-pointer hover:bg-accent/30 rounded-lg p-2 transition-colors"
                          onClick={() => navigate(`/clients/${c.clientId}`)}
                        >
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">{i + 1}. {c.name}</span>
                            <span className="font-semibold text-primary">₹{c.sum?.toLocaleString("en-IN")}</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary/60 rounded-full transition-all" style={{ width: `${pct}%` }} />
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
