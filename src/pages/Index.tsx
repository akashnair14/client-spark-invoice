
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";
import { mockInvoices, mockClients } from "@/data/mockData";
import { BarChart3, Users, Wallet } from "lucide-react";
import { Chart } from "@/components/ui/chart";

// Get the current date in ISO format (YYYY-MM-DD)
const currentDate = new Date().toISOString().split('T')[0];

// Function to get month name from date
const getMonthFromDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
};

// Calculate total revenue
const totalRevenue = mockInvoices.reduce((sum, invoice) => sum + invoice.total, 0);

// Calculate overdue invoices
const overdueInvoices = mockInvoices.filter(invoice => invoice.status === "overdue").length;

// Calculate total clients
const totalClients = mockClients.length;

// Prepare monthly revenue data
const monthlyRevenueMap = mockInvoices.reduce((acc, invoice) => {
  const month = getMonthFromDate(invoice.date);
  if (!acc[month]) {
    acc[month] = 0;
  }
  acc[month] += invoice.total;
  return acc;
}, {} as Record<string, number>);

const monthlyRevenueData = Object.keys(monthlyRevenueMap).map(month => ({
  name: month,
  revenue: monthlyRevenueMap[month],
}));

// Prepare invoice status data
const invoiceStatusCount = mockInvoices.reduce((acc, invoice) => {
  if (!acc[invoice.status]) {
    acc[invoice.status] = 0;
  }
  acc[invoice.status]++;
  return acc;
}, {} as Record<string, number>);

const invoiceStatusData = Object.keys(invoiceStatusCount).map(status => ({
  name: status,
  value: invoiceStatusCount[status],
}));

// Prepare top clients data
const clientRevenue = mockInvoices.reduce((acc, invoice) => {
  const clientId = invoice.clientId;
  const client = mockClients.find(c => c.id === clientId);
  
  if (client) {
    if (!acc[client.companyName]) {
      acc[client.companyName] = 0;
    }
    acc[client.companyName] += invoice.total;
  }
  
  return acc;
}, {} as Record<string, number>);

const topClientsData = Object.entries(clientRevenue)
  .map(([name, revenue]) => ({ name, revenue }))
  .sort((a, b) => b.revenue - a.revenue)
  .slice(0, 5);

// Status colors
const STATUS_COLORS = {
  draft: "#94a3b8",
  sent: "#3b82f6",
  paid: "#10b981",
  pending: "#f59e0b",
  overdue: "#ef4444",
};

const Index = () => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  
  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">Welcome to your invoice management dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground pt-1">
              From {mockInvoices.length} invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueInvoices}</div>
            <p className="text-xs text-muted-foreground pt-1">
              Invoices requiring attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground pt-1">
              Active client accounts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Revenue trend over the past months</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Chart
              config={{
                type: "bar",
                options: {
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                },
                data: {
                  labels: monthlyRevenueData.map(d => d.name),
                  datasets: [
                    {
                      label: "Revenue",
                      data: monthlyRevenueData.map(d => d.revenue),
                      backgroundColor: "hsl(var(--primary))",
                    },
                  ],
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Chart>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Status</CardTitle>
            <CardDescription>Distribution of invoice status</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Chart
              config={{
                type: "pie",
                data: {
                  labels: invoiceStatusData.map(d => d.name),
                  datasets: [
                    {
                      data: invoiceStatusData.map(d => d.value),
                      backgroundColor: invoiceStatusData.map(d => STATUS_COLORS[d.name as keyof typeof STATUS_COLORS]),
                    },
                  ],
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Pie
                    data={invoiceStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {invoiceStatusData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Chart>
          </CardContent>
        </Card>
      </div>

      {/* Top Clients */}
      <Card>
        <CardHeader>
          <CardTitle>Top Clients</CardTitle>
          <CardDescription>Clients by revenue</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={topClientsData}
              margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" className="text-xs" />
              <YAxis type="category" dataKey="name" className="text-xs" width={150} />
              <Tooltip
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
              />
              <Bar dataKey="revenue" fill="#9b87f5" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Index;
