
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  clients: any[];
}

const RecentClients: React.FC<Props> = ({ clients }) => {
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-700" />
          Recent Clients
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {clients.slice(0, 7).map((client) => (
          <div
            key={client.id}
            className="flex justify-between items-center px-2 py-1 rounded hover:bg-muted/40 cursor-pointer transition"
            onClick={() => navigate(`/clients/${client.id}`)}
            tabIndex={0}
            aria-label={`View details for ${client.companyName}`}
          >
            <div>
              <div className="text-sm font-medium">{client.companyName}</div>
              <div className="text-xs text-muted-foreground">{client.email}</div>
            </div>
            <div className="flex flex-wrap gap-1">
              {client.tags?.map(tag =>
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentClients;
