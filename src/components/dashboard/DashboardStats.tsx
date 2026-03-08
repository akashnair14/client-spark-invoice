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
      accentClass: "text-primary",
      bgClass: "bg-primary/8",
    },
    {
      label: "Total Invoiced",
      value: `₹${totalInvoiced.toLocaleString("en-IN")}`,
      icon: PieChart,
      route: "/invoices",
      accentClass: "text-info",
      bgClass: "bg-info/8",
    },
    {
      label: "Invoices",
      value: totalInvoices,
      icon: FileText,
      route: "/invoices",
      accentClass: "text-warning",
      bgClass: "bg-warning/8",
    },
    {
      label: "Paid",
      value: paidInvoices,
      icon: CheckCircle2,
      route: "/invoices?filter=paid",
      accentClass: "text-success",
      bgClass: "bg-success/8",
    },
  ];

  return (
    <>
      {stats.map((s, i) => (
        <Card
          key={s.label}
          onClick={() => navigate(s.route)}
          className={cn(
            "cursor-pointer transition-all duration-200 hover:shadow-elevated-lg hover:-translate-y-0.5 border-border/40 animate-fade-in",
            `stagger-${i + 1}`
          )}
          tabIndex={0}
          aria-label={s.label}
        >
          <CardContent className="flex items-center gap-3 p-3.5 md:p-5">
            <div className={cn("p-2.5 rounded-xl", s.bgClass)}>
              <s.icon className={cn("h-4 w-4 md:h-5 md:w-5", s.accentClass)} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] md:text-xs text-muted-foreground font-semibold uppercase tracking-wider">{s.label}</p>
              <p className="text-lg md:text-2xl font-bold text-foreground truncate tracking-tight">{s.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default DashboardStats;
