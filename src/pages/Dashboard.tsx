
import React from "react";
import Layout from "@/components/layout/Layout";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import RecentClients from "@/components/dashboard/RecentClients";
import RecentInvoices from "@/components/dashboard/RecentInvoices";
import { mockClients } from "@/data/mockData";

// We'll demo with mockClients and derive mockInvoices for now.
const mockInvoices = [
  {
    id: "inv-1",
    clientId: "client1",
    clientName: "Acme Corp",
    amount: 24000,
    date: "2024-06-10",
    status: "paid"
  },
  {
    id: "inv-2",
    clientId: "client2",
    clientName: "Globex Ltd",
    amount: 12000,
    date: "2024-06-08",
    status: "pending"
  },
  {
    id: "inv-3",
    clientId: "client3",
    clientName: "Initech",
    amount: 8000,
    date: "2024-05-29",
    status: "overdue"
  }
];

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <div className="pb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-blue-900 dark:text-blue-100">
          Dashboard
        </h1>
        <p className="text-muted-foreground mb-6">
          Welcome back! Here’s an overview of your business performance.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
          <DashboardStats clients={mockClients} invoices={mockInvoices} />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <DashboardCharts clients={mockClients} invoices={mockInvoices} />
            <RecentInvoices invoices={mockInvoices} />
          </div>
          <div>
            <RecentClients clients={mockClients} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
