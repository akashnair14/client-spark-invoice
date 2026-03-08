
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ClientFormValues } from "@/schemas/clientSchema";

interface ClientFormFieldsProps {
  form: UseFormReturn<ClientFormValues>;
}

const ClientFormFields = ({ form }: ClientFormFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="companyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name <span className="text-destructive">*</span></FormLabel>
            <FormControl>
              <Input placeholder="e.g. Acme Corp" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="gstNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>GST Number</FormLabel>
            <FormControl>
              <Input placeholder="e.g. 22AAAAA0000A1Z5" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input type="tel" inputMode="numeric" placeholder="e.g. 9876543210" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="e.g. client@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="bankAccountNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bank Account Number</FormLabel>
            <FormControl>
              <Input inputMode="numeric" placeholder="e.g. 123456789012" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="bankDetails"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bank Details</FormLabel>
            <FormControl>
              <Input placeholder="e.g. HDFC Bank, IFSC: HDFC0001234" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem className="col-span-1 md:col-span-2">
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Textarea placeholder="Full address..." {...field} rows={3} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ClientFormFields;
