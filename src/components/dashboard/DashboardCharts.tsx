import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Client, Invoice } from "@/types";

interface DashboardChartsProps {
  clients: Client[];
  invoices: Invoice[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ clients, invoices }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const data = invoices.slice(0, isMobile ? 5 : 10).map(inv => ({
    name: inv.clientName?.length > 10 ? inv.clientName.slice(0, 10) + "…" : inv.clientName,
    clientId: inv.clientId,
    Amount: inv.amount,
    Status: inv.status,
    invId: inv.id,
  }));

  const handleBarClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const clientId = data.activePayload[0].payload.clientId;
      if (clientId) navigate(`/clients/${clientId}`);
    }
  };

  return (
    <Card className="border-border/40">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Invoice Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={isMobile ? 200 : 260}>
          <BarChart data={data} onClick={handleBarClick}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <XAxis dataKey="name" tick={{ fontSize: isMobile ? 10 : 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: isMobile ? 10 : 12, fill: 'hsl(var(--muted-foreground))' }} width={isMobile ? 40 : 60} axisLine={false} tickLine={false} />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '13px',
                boxShadow: '0 4px 12px -2px hsl(var(--foreground) / 0.08)',
              }}
            />
            <Bar dataKey="Amount" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        {!isMobile && data.length > 0 && (
          <div className="flex flex-wrap justify-end mt-3 gap-1.5">
            {data.slice(0, 5).map((d, index) => (
              <button
                key={`${d.clientId}-${index}`}
                onClick={() => d.clientId && navigate(`/clients/${d.clientId}`)}
                className="text-xs px-2.5 py-1 border border-border/60 rounded-md hover:bg-accent transition-all text-muted-foreground hover:text-foreground font-medium"
              >
                {d.name}
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCharts;
