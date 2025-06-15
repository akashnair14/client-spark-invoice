import React, { useMemo, useState } from "react";
import Layout from "@/components/layout/Layout";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import RecentClients from "@/components/dashboard/RecentClients";
import RecentInvoices from "@/components/dashboard/RecentInvoices";

// Move to backend later, for now use empty arrays/placeholders
const mockInvoices: any[] = [];
const clients: any[] = []; // TODO: Fetch from backend

// Top clients by total invoice amount
const getTopClients = (clients: any[], invoices: any[], n = 3) => {
  const totals: Record<string, { name: string, sum: number }> = {};
  invoices.forEach(inv => {
    if (!totals[inv.clientId]) totals[inv.clientId] = {
      name: inv.clientName,
      sum: 0
    };
    totals[inv.clientId].sum += inv.amount;
  });
  return Object.entries(totals)
    .sort((a, b) => b[1].sum - a[1].sum)
    .slice(0, n)
    .map(([cid, v]) => ({ clientId: cid, ...v }));
};

// Mock activity log
const mockActivity = [
  { time: "2 min ago", message: "Generated invoice for Acme Corp" },
  { time: "20 min ago", message: "Client Initech added" },
  { time: "50 min ago", message: "Invoice overdue: Initech" },
  { time: "2h ago", message: "Payment received from Globex Ltd" },
];

const Dashboard: React.FC = () => {
  const [search, setSearch] = useState("");
  const clients = useMemo(() => {
    if (!search.trim()) return clients;
    return clients.filter(
      (c: any) =>
        c.companyName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, clients]);
  const invoices = useMemo(() => {
    if (!search.trim()) return mockInvoices;
    return mockInvoices.filter(
      (i: any) =>
        i.clientName.toLowerCase().includes(search.toLowerCase()) ||
        i.id.toString().toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const topClients = useMemo(() => getTopClients(clients, invoices), [clients, invoices]);

  return (
    <Layout>
      <div className="pb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-blue-900 dark:text-blue-100">
          Dashboard
        </h1>
        <p className="text-muted-foreground mb-4">
          Welcome back! Here’s an overview of your business performance.
        </p>
        {/* Search bar */}
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
              <span className="text-xs text-gray-500">Showing results for “{search}”</span>
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
          <DashboardStats clients={clients} invoices={invoices} />
        </div>
        
        {/* Top clients */}
        <div className="mb-6">
          <div className="bg-white dark:bg-muted rounded-md shadow p-4 border flex flex-col md:flex-row gap-6 items-start">
            <div>
              <h2 className="text-lg font-semibold mb-2 text-blue-800">Top Clients</h2>
              <ol>
                {topClients.map((c, i) => (
                  <li
                    key={c.clientId}
                    className="flex justify-between gap-3 border-b py-2 text-sm cursor-pointer hover:bg-accent/40"
                    onClick={() => c.clientId && window.location.assign(`/clients/${c.clientId}`)}
                  >
                    <div>
                      <span className="font-medium">{i + 1}.</span>{" "}
                      {c.name}
                    </div>
                    <span className="font-semibold text-blue-700">
                      ₹{c.sum.toLocaleString("en-IN")}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            {/* Activity log */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-2 text-blue-800">Recent Activity</h2>
              <ul>
                {mockActivity.map((a, idx) => (
                  <li key={idx} className="flex justify-between text-sm text-muted-foreground pb-1">
                    <span>{a.message}</span>
                    <span className="text-xs text-blue-500">{a.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <DashboardCharts clients={clients} invoices={invoices} />
            <RecentInvoices invoices={invoices} />
          </div>
          <div>
            <RecentClients clients={clients} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
