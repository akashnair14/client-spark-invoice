
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BadgeCheck, AlertCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  invoices: {
    id: string;
    clientName: string;
    clientId?: string;
    amount: number;
    date: string;
    status: string;
  }[];
}

const statusColor = {
  paid: "bg-primary/15 text-primary",
  pending: "bg-accent/30 text-foreground",
  overdue: "bg-destructive/15 text-destructive animate-pulse"
};

const statusIcon = {
  paid: <BadgeCheck className="w-4 h-4 text-primary mr-1" />,
  pending: <Clock className="w-4 h-4 text-muted-foreground mr-1" />,
  overdue: <AlertCircle className="w-4 h-4 text-destructive mr-1" />
};

const RecentInvoices: React.FC<Props> = ({ invoices }) => {
  const navigate = useNavigate();
  return (
    <Card className="animate-enter hover-scale">
      <CardHeader>
        <CardTitle className="text-lg">Recent Invoices</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {invoices.slice(0, 5).map((inv, idx) => (
          <div
            key={inv.id}
            className="flex justify-between items-center px-2 py-1 rounded hover:bg-muted/40 cursor-pointer transition hover-scale animate-fade-in"
            style={{ animationDelay: `${idx * 60}ms` }}
            onClick={() => navigate(`/invoices/${inv.id}`)}
            tabIndex={0}
            aria-label={`Go to invoice ${inv.id} for ${inv.clientName}`}
          >
            <div
              onClick={(e) => { e.stopPropagation(); if (inv.clientId) navigate(`/clients/${inv.clientId}`); }}
              className="text-primary font-medium cursor-pointer underline-offset-4 hover:underline mr-2"
              tabIndex={0}
              aria-label={`Go to client ${inv.clientName}`}
            >
              {inv.clientName}
            </div>
            <div className="flex items-center">
              <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColor[inv.status as keyof typeof statusColor]}`}>
                {statusIcon[inv.status as keyof typeof statusIcon]} {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
              </span>
              <span className="ml-4 font-bold">₹{inv.amount.toLocaleString("en-IN")}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentInvoices;
