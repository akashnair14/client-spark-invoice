
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, Users, Plus, PieChart, ArrowDown, ArrowUp, BarChart3 } from "lucide-react";
import { mockClients, mockInvoices } from "@/data/mockData";
import { 
  ChartContainer, 
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { 
  BarChart,
  Bar,
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip, 
  CartesianGrid,
  PieChart as RechartPieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const Index = () => {
  // For a real app, these would come from API calls
  const clientCount = mockClients.length;
  const invoiceCount = mockInvoices.length;
  const totalRevenue = mockInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const pendingInvoices = mockInvoices.filter(invoice => invoice.status !== 'paid').length;
  
  // Calculate month-wise revenue for line chart
  const currentYear = new Date().getFullYear();
  const monthlyData = Array(12).fill(0).map((_, index) => ({
    name: new Date(currentYear, index).toLocaleString('default', { month: 'short' }),
    amount: 0
  }));
  
  mockInvoices.forEach(invoice => {
    const date = new Date(invoice.date);
    if (date.getFullYear() === currentYear) {
      const month = date.getMonth();
      monthlyData[month].amount += invoice.total;
    }
  });
  
  // Status-based pie chart data
  const statusData = [
    { name: 'Paid', value: mockInvoices.filter(i => i.status === 'paid').length },
    { name: 'Pending', value: mockInvoices.filter(i => i.status === 'pending').length },
    { name: 'Overdue', value: mockInvoices.filter(i => i.status === 'overdue').length }
  ];
  
  const COLORS = ['#0088FE', '#FFBB28', '#FF8042'];
  
  // Recent clients for bar chart
  const recentClientsData = mockClients.slice(0, 5).map(client => {
    const clientInvoices = mockInvoices.filter(inv => inv.clientId === client.id);
    const totalAmount = clientInvoices.reduce((sum, inv) => sum + inv.total, 0);
    
    return {
      name: client.companyName.substring(0, 10) + (client.companyName.length > 10 ? '...' : ''),
      amount: totalAmount
    };
  });

  return (
    <Layout>
      <div className="page-header mb-6">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description text-sm text-muted-foreground">Overview of your business metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientCount}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
              <span>+4% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoiceCount}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
              <span>+12% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
              <span>+8% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvoices}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
              <span>-2% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-md">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={{ amount: { theme: { light: 'hsl(var(--primary))' } } }}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(value) => `₹${value}`} 
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  dataKey="amount" 
                  name="amount" 
                  type="monotone"
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2} 
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-md">Invoice Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <RechartPieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(value) => [`${value} invoices`, 'Count']} />
              </RechartPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="text-md">Top Clients by Revenue</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={{ amount: { theme: { light: 'hsl(var(--primary))' } } }}>
              <BarChart data={recentClientsData} margin={{ top: 5, right: 30, left: 20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(value) => `₹${value}`} 
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="amount" name="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 flex justify-end">
        <div className="grid grid-cols-2 gap-4">
          <Link to="/clients/new">
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" /> New Client
            </Button>
          </Link>
          <Link to="/invoices/new">
            <Button className="w-full" variant="outline">
              <Plus className="h-4 w-4 mr-2" /> New Invoice
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
