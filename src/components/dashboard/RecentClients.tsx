import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Client } from "@/types";

interface Props {
  clients: Client[];
}

const RecentClients: React.FC<Props> = ({ clients }) => {
  const navigate = useNavigate();

  if (clients.length === 0) {
    return (
      <Card className="border-border/40">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Recent Clients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">No clients yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/40">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          Recent Clients
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {clients.slice(0, 7).map((client) => (
          <div
            key={client.id}
            className="flex items-center justify-between p-2.5 rounded-lg hover:bg-accent/50 cursor-pointer transition-all duration-150"
            onClick={() => navigate(`/clients/${client.id}`)}
            tabIndex={0}
            aria-label={`View details for ${client.companyName}`}
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{client.companyName}</p>
              <p className="text-xs text-muted-foreground truncate">{client.email || "—"}</p>
            </div>
            <div className="flex items-center gap-1.5 ml-2 shrink-0">
              {client.tags?.slice(0, 1).map(tag =>
                <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">{tag}</Badge>
              )}
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentClients;
