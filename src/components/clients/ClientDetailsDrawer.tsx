import { useState, useEffect } from "react";
import { Client } from "@/types";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { X, Phone, Mail, MapPin, CreditCard, Building, FileText, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";

interface ClientDetailsDrawerProps {
  client: Client | null;
  open: boolean;
  onClose: () => void;
}

const ClientDetailsDrawer = ({ client, open, onClose }: ClientDetailsDrawerProps) => {
  if (!client) return null;

  // Remove invoice-specific stats, or add a TODO
  // For now, set all stats to placeholders until backend is ready
  const clientInvoices: any[] = []; // TODO: Fetch invoices from backend
  const totalAmount = 0;
  const pendingInvoices: any[] = [];
  const lastInvoice = undefined;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'frequent': return 'bg-blue-100 text-blue-800';
      case 'delayed payer': return 'bg-red-100 text-red-800';
      case 'vip': return 'bg-purple-100 text-purple-800';
      case 'new': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="flex flex-row items-center justify-between">
          <DrawerTitle className="flex items-center gap-3">
            <Building className="h-5 w-5" />
            {client.companyName}
          </DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Status and Tags */}
          <div className="flex flex-wrap gap-2 items-center">
            {client.status && (
              <Badge className={getStatusColor(client.status)}>
                {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
              </Badge>
            )}
            {client.tags?.map((tag, index) => (
              <Badge key={index} variant="outline" className={getTagColor(tag)}>
                {tag}
              </Badge>
            ))}
          </div>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Company Name</p>
                    <p className="font-medium">{client.companyName}</p>
                  </div>
                </div>
                {client.contactName && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Contact Person</p>
                      <p className="font-medium">{client.contactName}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{client.phoneNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{client.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{client.address}</p>
                    {(client.city || client.state) && (
                      <p className="text-sm text-muted-foreground">
                        {client.city}{client.city && client.state ? ', ' : ''}{client.state}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">GST Number</p>
                    <p className="font-medium">{client.gstNumber}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{clientInvoices.length}</p>
                  <p className="text-sm text-muted-foreground">Total Invoices</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">₹{totalAmount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Calendar className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-600">{pendingInvoices.length}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-lg font-bold text-purple-600">
                    {lastInvoice ? format(new Date(lastInvoice.date), 'MMM dd') : 'N/A'}
                  </p>
                  <p className="text-sm text-muted-foreground">Last Invoice</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Banking Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Banking Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Account Number</p>
                <p className="font-medium">{client.bankAccountNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bank Details</p>
                <p className="font-medium">{client.bankDetails}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ClientDetailsDrawer;
