import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Client } from "@/types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

/**
 * Calculate the next incremental invoice number based on existing invoices.
 * Future: This will be moved to .NET Core backend.
 */
const getNextInvoiceNumber = () => {
  try {
    const storedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const maxNumber = storedInvoices.reduce((max: number, invoice: any) => {
      const num = parseInt(invoice.invoiceNumber) || 0;
      return num > max ? num : max;
    }, 0);
    return (maxNumber + 1).toString();
  } catch {
    return "1";
  }
};

interface EnhancedInvoiceDetailsProps {
  clients: Client[];
  initialClientId?: string;
}

const EnhancedInvoiceDetails = ({ clients, initialClientId }: EnhancedInvoiceDetailsProps) => {
  const form = useFormContext();

  // Set the initial client and next invoice number if not set
  useEffect(() => {
    if (initialClientId && form.getValues("clientId") !== initialClientId) {
      form.setValue("clientId", initialClientId);
    }
    if (!form.getValues("invoiceNumber")) {
      form.setValue("invoiceNumber", getNextInvoiceNumber());
    }
  }, [initialClientId, form]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormField
        control={form.control}
        name="clientId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Client</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.companyName}
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
            <FormLabel>Invoice Number</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => field.onChange(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default EnhancedInvoiceDetails;
