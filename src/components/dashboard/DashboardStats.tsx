
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, PieChart, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardStatsProps {
  clients: any[];
  invoices: any[];
}

const statRoutes: Record<string, string> = {
  "Clients": "/clients",
  "Total Invoiced": "/invoices",
  "Invoices": "/invoices",
  "Paid": "/invoices?filter=paid"
};

const DashboardStats: React.FC<DashboardStatsProps> = ({ clients, invoices }) => {
  const totalClients = clients.length;
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter((i) => i.status === "paid").length;
  const navigate = useNavigate();

  const stats = [
    {
      label: "Clients",
      value: totalClients,
      icon: <Users className="h-6 w-6 text-blue-700" />,
      color: "bg-blue-100"
    },
    {
      label: "Total Invoiced",
      value: `₹${totalInvoiced.toLocaleString("en-IN")}`,
      icon: <PieChart className="h-6 w-6 text-green-700" />,
      color: "bg-green-100"
    },
    {
      label: "Invoices",
      value: totalInvoices,
      icon: <FileText className="h-6 w-6 text-yellow-700" />,
      color: "bg-yellow-100"
    },
    {
      label: "Paid",
      value: paidInvoices,
      icon: <CheckCircle2 className="h-6 w-6 text-emerald-700" />,
      color: "bg-emerald-100"
    }
  ];

  return (
    <>
      {stats.map((s) => (
        <Card
          key={s.label}
          onClick={() => navigate(statRoutes[s.label] || "/")}
          className="flex items-center gap-4 py-4 hover:shadow-lg hover:bg-accent/40 cursor-pointer transition"
          tabIndex={0}
          aria-label={s.label}
        >
          <div className={`${s.color} rounded-full p-3`}>
            {s.icon}
          </div>
          <CardHeader className="p-0">
            <CardTitle className="text-lg font-semibold">{s.value}</CardTitle>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </CardHeader>
        </Card>
      ))}
    </>
  );
};

export default DashboardStats;
