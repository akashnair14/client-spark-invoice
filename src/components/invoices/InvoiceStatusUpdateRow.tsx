
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { Invoice, Client } from "@/types";

interface StatusUpdateRowProps {
  invoice: Invoice;
  client?: Client;
  onUpdate: (id: string, status: Invoice["status"]) => void;
}
// Only valid transitions
const statusTransitionOptions = (status: Invoice["status"]) => {
  if (status === "paid") return ["pending", "overdue"];
  if (status === "pending") return ["paid", "overdue"];
  if (status === "overdue") return ["pending", "paid"];
  return [];
};

const statusColors = {
  paid: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  overdue: "bg-red-100 text-red-800 animate-pulse"
};

const statusButtonColors: Record<string, string> = {
  paid:
    "bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700",
  pending:
    "bg-yellow-500 hover:bg-yellow-600 text-white dark:bg-yellow-600 dark:hover:bg-yellow-700",
  overdue:
    "bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700",
};

const InvoiceStatusUpdateRow: React.FC<StatusUpdateRowProps> = ({ invoice, client, onUpdate }) => {
  const options = statusTransitionOptions(invoice.status);
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-muted/30 rounded p-4 gap-2 border shadow-sm">
      <div>
        <div className="font-semibold text-base">
          {invoice.invoiceNumber}{" "}
          <span className="font-normal text-xs text-muted-foreground">
            ({client?.companyName ?? 'Unknown Client'})
          </span>
        </div>
        <div className="text-xs text-muted-foreground">
          {invoice.date ? format(parseISO(invoice.date), "dd MMM yyyy") : ""}&nbsp;|&nbsp;
          Total: <span className="font-medium">₹{invoice.total.toLocaleString("en-IN")}</span>
        </div>
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <Badge className={statusColors[invoice.status]||""}>
          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
        </Badge>
        <div className="flex gap-2 flex-wrap">
          {["paid","pending","overdue"].map((stat) => (
            <Button
              key={stat}
              variant="outline"
              className={[
                stat === invoice.status
                  ? statusButtonColors[stat]
                  : "border border-input bg-background hover:opacity-90 text-foreground dark:bg-background dark:border-input",
                "transition-all font-semibold",
                stat !== invoice.status && !options.includes(stat) ? "opacity-60 cursor-not-allowed" : ""
              ]
                .filter(Boolean)
                .join(" ")}
              disabled={stat === invoice.status || !options.includes(stat)}
              onClick={() => {
                if (stat !== invoice.status) onUpdate(invoice.id, stat as Invoice["status"]);
              }}
              aria-label={`Mark as ${stat}`}
            >
              Mark as {stat.charAt(0).toUpperCase()+stat.slice(1)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvoiceStatusUpdateRow;

