
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Client } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockInvoices } from "@/data/mockData";

interface EnhancedInvoiceDetailsProps {
  clients: Client[];
  onClientSelect: (client: Client | undefined) => void;
}

const EnhancedInvoiceDetails = ({ clients, onClientSelect }: EnhancedInvoiceDetailsProps) => {
  const form = useFormContext();
  const [selectedClient, setSelectedClient] = useState<Client | undefined>();

  // Auto-increment invoice number
  const generateInvoiceNumber = (clientId: string) => {
    if (!clientId) return "";
    
    const today = new Date();
    const currentYear = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
    const nextYear = currentYear + 1;
    
    const startDate = new Date(`${currentYear}-04-01`);
    const endDate = new Date(`${nextYear}-03-31`);
    
    const clientInvoices = mockInvoices.filter(invoice => {
      const invoiceDate = new Date(invoice.date);
      return invoice.clientId === clientId && 
             invoiceDate >= startDate && 
             invoiceDate <= endDate;
    });
    
    const nextNumber = clientInvoices.length + 1;
    return nextNumber.toString().padStart(3, '0');
  };

  // Handle client selection
  const handleClientChange = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    setSelectedClient(client);
    onClientSelect(client);
    
    if (client) {
      // Auto-generate invoice number
      const invoiceNumber = generateInvoiceNumber(clientId);
      form.setValue("invoiceNumber", invoiceNumber);
      
      // Auto-detect GST type based on state
      const companyState = "Your Company State"; // This should come from company settings
      const clientState = client.state || "Same State";
      const gstType = companyState === clientState ? "regular" : "igst";
      form.setValue("gstType", gstType);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem className="col-span-full md:col-span-2">
                <FormLabel>Client *</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleClientChange(value);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        <div className="flex flex-col">
                          <span>{client.companyName}</span>
                          <span className="text-xs text-muted-foreground">{client.gstNumber}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="invoiceNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Number *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Auto-generated" readOnly className="bg-muted" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Date *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gstType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GST Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="regular">
                      <div className="flex items-center gap-2">
                        <span>CGST + SGST</span>
                        <Badge variant="secondary" className="text-xs">Same State</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="igst">
                      <div className="flex items-center gap-2">
                        <span>IGST</span>
                        <Badge variant="secondary" className="text-xs">Inter-State</Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Client Info Display */}
        {selectedClient && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Selected Client Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div><strong>GST:</strong> {selectedClient.gstNumber}</div>
              <div><strong>Phone:</strong> {selectedClient.phoneNumber}</div>
              <div className="col-span-full"><strong>Address:</strong> {selectedClient.address}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedInvoiceDetails;
