
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { v4 as uuidv4 } from 'uuid';
import { Form } from "@/components/ui/form";
import { Client } from "@/types";
import { InvoiceFormProvider } from "@/context/InvoiceFormContext";
import { useInvoiceItems } from "@/hooks/useInvoiceItems";
import InvoiceDetails from "./form/InvoiceDetails";
import InvoiceItemsTable from "./form/InvoiceItemsTable";
import InvoiceTotals from "./form/InvoiceTotals";
import InvoiceNotes from "./form/InvoiceNotes";
import FormActions from "./form/FormActions";

const formSchema = z.object({
  clientId: z.string().min(1, { message: "Please select a client" }),
  date: z.date(),
  dueDate: z.date(),
  invoiceNumber: z.string().min(1, { message: "Invoice number is required" }),
  items: z.array(
    z.object({
      id: z.string(),
      description: z.string().min(1, { message: "Description is required" }),
      quantity: z.coerce
        .number()
        .min(1, { message: "Quantity must be at least 1" }),
      hsnCode: z.string().min(1, { message: "HSN code is required" }),
      rate: z.coerce.number().min(0, { message: "Rate is required" }),
      gstRate: z.coerce.number(),
      amount: z.coerce.number(),
    })
  ).min(1, { message: "At least one item is required" }),
  notes: z.string().optional(),
});

interface InvoiceFormProps {
  clients: Client[];
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  initialClientId?: string;
}

const InvoiceForm = ({ clients, onSubmit, initialClientId }: InvoiceFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: initialClientId || "",
      date: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 14)), // Default to 14 days from now
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(
        new Date().getMonth() + 1
      ).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}-${Math.floor(
        Math.random() * 1000
      )
        .toString()
        .padStart(3, "0")}`,
      items: [
        {
          id: uuidv4(),
          description: "",
          quantity: 1,
          hsnCode: "",
          rate: 0,
          gstRate: 18,
          amount: 0,
        },
      ],
      notes: "",
    },
  });

  // Set initial client ID when provided
  useEffect(() => {
    if (initialClientId) {
      form.setValue("clientId", initialClientId);
    }
  }, [initialClientId, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // Calculate final amounts to ensure they're up to date
    const updatedItems = values.items.map(item => ({
      ...item,
      amount: item.quantity * item.rate
    }));
    
    const updatedValues = {
      ...values,
      items: updatedItems,
    };
    
    onSubmit(updatedValues);
  };

  return (
    <InvoiceFormProvider>
      <div className="space-y-8 mb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            {/* Client and Invoice Details */}
            <InvoiceDetails clients={clients} />

            {/* Invoice Items */}
            <InvoiceItemsTable />

            {/* Totals */}
            <InvoiceTotals />

            {/* Notes */}
            <InvoiceNotes />

            {/* Form Actions */}
            <FormActions />
          </form>
        </Form>
      </div>
    </InvoiceFormProvider>
  );
};

export default InvoiceForm;
