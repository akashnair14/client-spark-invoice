import React, { useMemo, useState } from "react";
import Layout from "@/components/layout/Layout";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import RecentClients from "@/components/dashboard/RecentClients";
import RecentInvoices from "@/components/dashboard/RecentInvoices";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Users, Calendar, Bell, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";
import type { Client, Invoice } from "@/types";
import PageSEO from "@/components/seo/PageSEO";

// Utility functions
const getTopClients = (clients: Client[], invoices: Invoice[], n = 3) => {
  const totals: Record<string, { name: string, sum: number }> = {};
  invoices.forEach(inv => {
    if (!totals[inv.clientId]) {
      const client = clients.find(c => c.id === inv.clientId);
      totals[inv.clientId] = {
        name: client?.companyName || inv.clientName,
        sum: 0
      };
    }
    totals[inv.clientId].sum += inv.amount;
  });
  return Object.entries(totals)
    .sort((a, b) => b[1].sum - a[1].sum)
    .slice(0, n)
    .map(([cid, v]) => ({ clientId: cid, ...v }));
};

// Generate recent activity from actual data
const generateRecentActivity = (clients: Client[], invoices: Invoice[]) => {
  const activity = [];
  
  // Recent invoices
  const recentInvoices = invoices
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  
  recentInvoices.forEach(inv => {
    activity.push({
      time: "Recent",
      message: `${inv.status === 'paid' ? 'Payment received' : 'Generated invoice'} for ${inv.clientName}`,
    });
  });
  
  // Recent clients
  const recentClients = clients.slice(0, 2);
  recentClients.forEach(client => {
    activity.push({
      time: "Recent",
      message: `Client ${client.companyName} added`,
    });
  });
  
  return activity.slice(0, 4);
};

// Generate smart notifications from data
const generateNotifications = (invoices: Invoice[]) => {
  const notifications = [];
  
  // Overdue invoices
  const overdueCount = invoices.filter(inv => inv.status === 'overdue').length;
  if (overdueCount > 0) {
    notifications.push({
      id: 1,
      text: `${overdueCount} invoice${overdueCount > 1 ? 's are' : ' is'} overdue`,
      icon: <Bell className="w-4 h-4 text-red-500" />,
      time: "Now"
    });
  }
  
  // Draft invoices
  const draftCount = invoices.filter(inv => inv.status === 'draft').length;
  if (draftCount > 0) {
    notifications.push({
      id: 2,
      text: `${draftCount} draft invoice${draftCount > 1 ? 's need' : ' needs'} to be sent`,
      icon: <FileText className="w-4 h-4 text-amber-500" />,
      time: "Now"
    });
  }
  
  // Recent activity
  const recentPaid = invoices.filter(inv => inv.status === 'paid').length;
  if (recentPaid > 0) {
    notifications.push({
      id: 3,
      text: `${recentPaid} payment${recentPaid > 1 ? 's' : ''} received this month`,
      icon: <Users className="w-4 h-4 text-green-500" />,
      time: "This month"
    });
  }
  
  return notifications.slice(0, 3);
};

const Dashboard: React.FC = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { clients, invoices, loading, error, refetch } = useDashboardData();

  // Filter data based on search
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

  // Computed data
  const topClients = useMemo(() => getTopClients(filteredClients, filteredInvoices), [filteredClients, filteredInvoices]);
  const recentActivity = useMemo(() => generateRecentActivity(filteredClients, filteredInvoices), [filteredClients, filteredInvoices]);
  const notifications = useMemo(() => generateNotifications(filteredInvoices), [filteredInvoices]);

  // Summary amounts by status
  const paidAmount = filteredInvoices.reduce((sum, inv) => inv.status === "paid" ? sum + inv.amount : sum, 0);
  const pendingAmount = filteredInvoices.reduce((sum, inv) => inv.status === "pending" ? sum + inv.amount : sum, 0);
  const overdueAmount = filteredInvoices.reduce((sum, inv) => inv.status === "overdue" ? sum + inv.amount : sum, 0);

  const hasData = filteredClients.length > 0 || filteredInvoices.length > 0;

  return (
    <Layout>
      <PageSEO
        title="Dashboard | SparkInvoice"
        description="View key metrics, recent activity, clients and invoices."
        canonicalUrl={window.location.origin + "/dashboard"}
      />
      <div className="pb-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-blue-900 dark:text-blue-100">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back! Here’s an overview of your business performance.
            </p>
          </div>
          {/* Quick Actions */}
          <div className="flex gap-2 mt-2 md:mt-0">
            <Button variant="default" className="flex gap-2" onClick={() => navigate("/invoices/new")}>
              <Plus className="w-4 h-4" /> New Invoice
            </Button>
            <Button variant="secondary" className="flex gap-2" onClick={() => navigate("/clients/new")}>
              <Plus className="w-4 h-4" /> Add Client
            </Button>
            <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Smart Notifications */}
        {!loading && notifications.length > 0 && (
          <div className="mb-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-yellow-500 animate-pulse" />
                <span className="font-medium text-yellow-900 dark:text-yellow-200">
                  Notifications
                </span>
              </div>
              <ul className="flex flex-wrap gap-3 ml-3">
                {notifications.map((note) => (
                  <li key={note.id} className="flex items-center gap-2 bg-white dark:bg-[#23232b] border border-yellow-100 dark:border-yellow-700 rounded px-3 py-1 text-xs">
                    {note.icon}
                    <span>{note.text}</span>
                    <span className="ml-2 text-muted-foreground">{note.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Loading and Error States */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">Error: {error}</p>
            <Button variant="outline" size="sm" onClick={refetch} className="mt-2">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        )}

        {/* Search bar */}
        {!loading && (
          <div className="mb-6 w-full flex flex-col md:flex-row md:justify-between md:items-center gap-3">
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔎 Search clients, invoices…"
              className="w-full md:w-1/3 border px-3 py-2 rounded-md outline-none bg-background"
            />
            <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
              {search && (
                <span className="text-xs text-gray-500">Showing results for "{search}"</span>
              )}
              <button
                onClick={() => setSearch("")}
                className="text-xs px-2 py-1 rounded bg-muted hover:bg-primary/20"
                style={{ display: search ? "inline-block" : "none" }}
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* 
          --- NEW: RECENT CLIENTS & RECENT INVOICES --- 
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Recent Clients */}
          <div className="bg-white dark:bg-muted border rounded-lg shadow flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Recent Clients</h2>
            </div>
            <div className="p-4">
              {filteredClients.length === 0 ? (
                <div className="text-muted-foreground text-center">No clients found.</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground">
                      <th className="text-left py-2">Company</th>
                      <th className="text-left py-2">Email</th>
                      <th className="text-left py-2">Phone</th>
                      <th className="text-center py-2">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                  {filteredClients.slice(0, 5).map((client) => (
                    <tr key={client.id} className="hover:bg-accent/30 transition">
                      <td className="py-2 font-semibold">{client.companyName}</td>
                      <td className="py-2">{client.email}</td>
                      <td className="py-2">{client.phone}</td>
                      <td className="py-2 text-center">
                        <button
                          className="text-blue-700 font-bold underline hover:text-blue-900 rounded px-2 py-1"
                          onClick={() => navigate(`/clients/${client.id}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          {/* Recent Invoices */}
          <div className="bg-white dark:bg-muted border rounded-lg shadow flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Recent Invoices</h2>
            </div>
            <div className="p-4">
              {filteredInvoices.length === 0 ? (
                <div className="text-muted-foreground text-center">No invoices found.</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground">
                      <th className="py-2">#</th>
                      <th className="py-2">Client</th>
                      <th className="py-2">Amount</th>
                      <th className="py-2">Status</th>
                      <th className="py-2 text-center">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                  {filteredInvoices.slice(0, 5).map((inv) => (
                    <tr key={inv.id} className="hover:bg-accent/30 transition">
                      <td className="py-2 font-medium">{inv.id}</td>
                      <td className="py-2">
                        <button
                          className="text-blue-700 underline hover:text-blue-900"
                          onClick={() => inv.clientId && navigate(`/clients/${inv.clientId}`)}
                        >
                          {inv.clientName}
                        </button>
                      </td>
                      <td className="py-2">₹{inv.amount.toLocaleString("en-IN")}</td>
                      <td className="py-2">
                        <span className={
                          inv.status === "paid" ? "bg-green-100 text-green-800 px-2 py-1 rounded"
                            : inv.status === "pending" ? "bg-yellow-100 text-yellow-800 px-2 py-1 rounded"
                              : "bg-red-100 text-red-800 px-2 py-1 rounded"
                        }>
                          {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-2 text-center">
                        <button
                          className="text-blue-700 font-bold underline hover:text-blue-900 rounded px-2 py-1"
                          onClick={() => navigate(`/invoices/${inv.id}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {!loading && (
          !hasData ? (
            <div className="flex flex-col items-center mt-16 mb-24">
              <img
                src="https://svgur.com/i/oD5.svg"
                alt="No data"
                className="w-40 h-40 mb-6 opacity-70"
              />
              <h2 className="text-xl font-semibold mb-2 dark:text-blue-100">No data to display</h2>
              <p className="mb-4 text-muted-foreground">Start by adding a client or creating an invoice.</p>
              <div className="flex gap-3">
                <Button variant="default" onClick={() => navigate("/clients/new")}>
                  <Users className="w-4 h-4 mr-1" /> Add Client
                </Button>
                <Button variant="secondary" onClick={() => navigate("/invoices/new")}>
                  <FileText className="w-4 h-4 mr-1" /> New Invoice
                </Button>
              </div>
            </div>
          )
            : (
              <>
                {/* Summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
                  <DashboardStats clients={filteredClients} invoices={filteredInvoices} />
                  {/* Add summary cards */}
                  <div className="bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-900 rounded-md flex flex-col items-center py-6">
                    <div className="text-lg font-bold text-green-700 dark:text-green-200">₹{paidAmount.toLocaleString("en-IN")}</div>
                    <div className="font-medium text-green-800 dark:text-green-100">Total Paid</div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 dark:bg-yellow-700/10 dark:border-yellow-800 rounded-md flex flex-col items-center py-6">
                    <div className="text-lg font-bold text-amber-700 dark:text-yellow-200">₹{pendingAmount.toLocaleString("en-IN")}</div>
                    <div className="font-medium text-amber-800 dark:text-yellow-100">Pending</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-900 rounded-md flex flex-col items-center py-6">
                    <div className="text-lg font-bold text-red-700 dark:text-red-200">₹{overdueAmount.toLocaleString("en-IN")}</div>
                    <div className="font-medium text-red-800 dark:text-red-100">Overdue</div>
                  </div>
                </div>

                {/* Top clients/activity row */}
                <div className="mb-6">
                  <div className="bg-white dark:bg-muted rounded-md shadow p-4 border flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-1 min-w-[220px]">
                      <h2 className="text-lg font-semibold mb-2 text-blue-800">Top Clients</h2>
                      <ol>
                        {topClients.map((c, i) => (
                          <li
                            key={c.clientId}
                            className="flex justify-between gap-3 border-b py-2 text-sm cursor-pointer hover:bg-accent/40"
                            onClick={() => c.clientId && navigate(`/clients/${c.clientId}`)}
                          >
                            <div>
                              <span className="font-medium">{i + 1}.</span>{" "}
                              {c.name}
                            </div>
                            <span className="font-semibold text-blue-700">
                              ₹{c.sum?.toLocaleString("en-IN")}
                            </span>
                          </li>
                        ))}
                        {topClients.length === 0 && (
                          <li className="text-muted-foreground text-sm py-2">No clients yet</li>
                        )}
                      </ol>
                    </div>
                    {/* Activity log */}
                    <div className="flex-1 min-w-[220px] border-l pl-6">
                      <h2 className="text-lg font-semibold mb-2 text-blue-800">Recent Activity</h2>
                      <ul>
                        {recentActivity.length > 0 ? recentActivity.map((a, idx) => (
                          <li key={idx} className="flex justify-between text-sm text-muted-foreground pb-1">
                            <span>{a.message}</span>
                            <span className="text-xs text-blue-500">{a.time}</span>
                          </li>
                        )) : (
                          <li className="text-sm text-muted-foreground">No recent activity</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Main grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  <div className="xl:col-span-2 space-y-8">
                    <DashboardCharts clients={filteredClients} invoices={filteredInvoices} />
                    <RecentInvoices invoices={filteredInvoices} />
                  </div>
                  <div>
                    <RecentClients clients={filteredClients} />
                  </div>
                </div>
              </>
            )
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
