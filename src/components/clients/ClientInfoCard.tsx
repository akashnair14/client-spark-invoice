
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User, Building, Mail, Phone, MapPin, Globe, FileText, Receipt
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Client } from "@/types";

interface ClientInfoCardProps {
  client: Client;
  currentYearInvoicesCount: number;
  onCreateInvoice: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ClientInfoCard: React.FC<ClientInfoCardProps> = ({
  client,
  currentYearInvoicesCount,
  onCreateInvoice,
  onEdit,
  onDelete,
}) => (
  <Card className="md:col-span-1">
    <CardHeader>
      <CardTitle>Client Information</CardTitle>
      <CardDescription>Contact details and address</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-start space-x-4">
        <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">Company</p>
          <p className="text-sm text-muted-foreground">{client.companyName}</p>
        </div>
      </div>
      <div className="flex items-start space-x-4">
        <Receipt className="h-5 w-5 text-muted-foreground mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">GST Number</p>
          <p className="text-sm text-muted-foreground">{client.gstNumber || "Not provided"}</p>
        </div>
      </div>
      <div className="flex items-start space-x-4">
        <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">FY Invoices</p>
          <p className="text-sm text-muted-foreground">{currentYearInvoicesCount}</p>
        </div>
      </div>
      <div className="flex items-start space-x-4">
        <User className="h-5 w-5 text-muted-foreground mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">Contact Person</p>
          <p className="text-sm text-muted-foreground">{client.contactName}</p>
        </div>
      </div>
      <div className="flex items-start space-x-4">
        <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">Email</p>
          <p className="text-sm text-muted-foreground">{client.email}</p>
        </div>
      </div>
      <div className="flex items-start space-x-4">
        <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">Phone</p>
          <p className="text-sm text-muted-foreground">{client.phone}</p>
        </div>
      </div>
      <Separator />
      <div className="flex items-start space-x-4">
        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">Address</p>
          <p className="text-sm text-muted-foreground">
            {client.address}, {client.city}, {client.state} {client.postalCode}
          </p>
        </div>
      </div>
      {client.website && (
        <div className="flex items-start space-x-4">
          <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Website</p>
            <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
              {client.website}
            </a>
          </div>
        </div>
      )}
    </CardContent>
    <CardFooter className="flex flex-col w-full gap-2">
      <Button onClick={onCreateInvoice} className="w-full">
        <FileText className="mr-2 h-4 w-4" /> Create New Invoice
      </Button>
      <div className="w-full flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="destructive" className="flex-1" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </CardFooter>
  </Card>
);

export default ClientInfoCard;
