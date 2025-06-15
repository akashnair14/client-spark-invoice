
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface DashboardChartsProps {
  clients: any[];
  invoices: any[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ clients, invoices }) => {
  // Bar chart for recent invoices by amount
  const data = invoices.map(inv => ({
    name: inv.clientName,
    clientId: inv.clientId,
    Amount: inv.amount,
    Status: inv.status,
    invId: inv.id,
  }));

  const navigate = useNavigate();

  const handleBarClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const clientId = data.activePayload[0].payload.clientId;
      if (clientId) navigate(`/clients/${clientId}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Invoice Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} onClick={handleBarClick}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <RechartsTooltip />
            <Bar dataKey="Amount" fill="#0e7490" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-end mt-2 gap-2">
          {data.map(d => (
            <button
              key={d.clientId}
              onClick={() => d.clientId && navigate(`/clients/${d.clientId}`)}
              className="text-xs px-3 py-1 border rounded hover:bg-muted"
              aria-label={`View details for ${d.name}`}
            >
              {d.name}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCharts;
