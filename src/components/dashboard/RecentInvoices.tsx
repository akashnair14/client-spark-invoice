
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

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

const RecentInvoices: React.FC<Props> = ({ invoices }) => {
  const navigate = useNavigate();
  return (
    <Card className="border-border/40 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Recent Invoices</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {invoices.slice(0, 5).map((inv, idx) => (
          <div
            key={inv.id}
            className={cn(
              "flex justify-between items-center px-2.5 py-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-all duration-150 animate-fade-in",
              `stagger-${idx + 1}`
            )}
            onClick={() => navigate(`/invoices/${inv.id}`)}
            tabIndex={0}
            aria-label={`Go to invoice ${inv.id} for ${inv.clientName}`}
          >
            <div
              onClick={(e) => { e.stopPropagation(); if (inv.clientId) navigate(`/clients/${inv.clientId}`); }}
              className="text-foreground font-semibold text-sm cursor-pointer hover:text-primary transition-colors mr-2"
              tabIndex={0}
              aria-label={`Go to client ${inv.clientName}`}
            >
              {inv.clientName}
            </div>
            <div className="flex items-center gap-2.5">
              <Badge
                variant={
                  inv.status === "paid" ? "success" :
                  inv.status === "overdue" ? "destructive" :
                  inv.status === "pending" ? "warning" : "secondary"
                }
                className="text-[10px] px-1.5 py-0"
              >
                {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
              </Badge>
              <span className="font-bold text-sm tabular-nums">₹{inv.amount.toLocaleString("en-IN")}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentInvoices;
