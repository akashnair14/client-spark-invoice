import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, FileText, PieChart, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { Client, Invoice } from "@/types";

interface DashboardStatsProps {
  clients: Client[];
  invoices: Invoice[];
}

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
      icon: Users,
      route: "/clients",
      gradient: "from-primary/10 to-primary/5",
      iconColor: "text-primary",
    },
    {
      label: "Total Invoiced",
      value: `₹${totalInvoiced.toLocaleString("en-IN")}`,
      icon: PieChart,
      route: "/invoices",
      gradient: "from-info/10 to-info/5",
      iconColor: "text-info",
    },
    {
      label: "Invoices",
      value: totalInvoices,
      icon: FileText,
      route: "/invoices",
      gradient: "from-warning/10 to-warning/5",
      iconColor: "text-warning",
    },
    {
      label: "Paid",
      value: paidInvoices,
      icon: CheckCircle2,
      route: "/invoices?filter=paid",
      gradient: "from-success/10 to-success/5",
      iconColor: "text-success",
    },
  ];

  return (
    <>
      {stats.map((s, i) => (
        <Card
          key={s.label}
          onClick={() => navigate(s.route)}
          className={cn(
            "cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border-0 shadow-sm",
            `bg-gradient-to-br ${s.gradient}`
          )}
          tabIndex={0}
          aria-label={s.label}
        >
          <CardContent className="flex items-center gap-3 p-3 md:p-5">
            <div className={cn("p-2 md:p-2.5 rounded-xl bg-card/80 shadow-sm", s.iconColor)}>
              <s.icon className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider">{s.label}</p>
              <p className="text-lg md:text-2xl font-bold text-foreground truncate">{s.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default DashboardStats;
