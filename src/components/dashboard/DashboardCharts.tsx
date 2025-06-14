
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface DashboardChartsProps {
  clients: any[];
  invoices: any[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ clients, invoices }) => {
  // Simple demo: bar chart for recent invoices by amount
  const data = invoices.map(inv => ({
    name: inv.clientName,
    Amount: inv.amount,
    Status: inv.status
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Invoice Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <RechartsTooltip />
            <Bar dataKey="Amount" fill="#0e7490" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DashboardCharts;
