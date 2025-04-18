
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { v4 as uuidv4 } from 'uuid';
import { Form } from "@/components/ui/form";
import { Client } from "@/types";
import { InvoiceFormProvider } from "@/context/InvoiceFormContext";
import InvoiceDetails from "./form/InvoiceDetails";
import InvoiceItemsTable from "./form/InvoiceItemsTable";
import InvoiceTotals from "./form/InvoiceTotals";
import InvoiceNotes from "./form/InvoiceNotes";
import FormActions from "./form/FormActions";
import AdditionalDetails from "./form/AdditionalDetails";
import { mockInvoices } from "@/data/mockData";

const formSchema = z.object({
  clientId: z.string().min(1, { message: "Please select a client" }),
  date: z.date(),
  invoiceNumber: z.string().min(1, { message: "Invoice number is required" }),
  challanNumber: z.string().optional(),
  challanDate: z.date().optional().nullable(),
  poNumber: z.string().optional(),
  poDate: z.date().optional().nullable(),
  dcNumber: z.string().optional(),
  dcDate: z.date().optional().nullable(),
  ewbNumber: z.string().optional(),
  gstType: z.enum(["regular", "igst"]).default("regular"),
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
      cgstRate: z.coerce.number(),
      sgstRate: z.coerce.number(),
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
  // Generate next invoice number for the client
  const getNextInvoiceNumber = (clientId: string) => {
    if (!clientId) return "";
    
    // Get current financial year
    const today = new Date();
    const currentYear = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
    const nextYear = currentYear + 1;
    const fyPrefix = `FY${currentYear.toString().slice(2)}-${nextYear.toString().slice(2)}`;
    
    // Filter invoices for selected client in current financial year
    const startDate = new Date(`${currentYear}-04-01`);
    const endDate = new Date(`${nextYear}-03-31`);
    
    const clientInvoices = mockInvoices.filter(invoice => {
      const invoiceDate = new Date(invoice.date);
      return invoice.clientId === clientId && 
             invoiceDate >= startDate && 
             invoiceDate <= endDate;
    });
    
    // Get next invoice number
    const nextNumber = clientInvoices.length + 1;
    
    return `${fyPrefix}/${nextNumber.toString().padStart(3, '0')}`;
  };
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: initialClientId || "",
      date: new Date(),
      invoiceNumber: "",
      challanNumber: "",
      challanDate: null,
      poNumber: "",
      poDate: null,
      dcNumber: "",
      dcDate: null,
      ewbNumber: "",
      gstType: "regular",
      items: [
        {
          id: uuidv4(),
          description: "",
          quantity: 1,
          hsnCode: "",
          rate: 0,
          gstRate: 18,
          cgstRate: 9,
          sgstRate: 9,
          amount: 0,
        },
      ],
      notes: "",
    },
  });

  // Set initial client ID and generate invoice number when client changes
  useEffect(() => {
    const clientId = form.getValues("clientId") || initialClientId;
    if (clientId) {
      form.setValue("clientId", clientId);
      const nextInvoiceNumber = getNextInvoiceNumber(clientId);
      form.setValue("invoiceNumber", nextInvoiceNumber);
    }
  }, [initialClientId, form, form.getValues("clientId")]);

  // Update invoice number when client changes
  const clientId = form.watch("clientId");
  useEffect(() => {
    if (clientId) {
      const nextInvoiceNumber = getNextInvoiceNumber(clientId);
      form.setValue("invoiceNumber", nextInvoiceNumber);
    }
  }, [clientId, form]);

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

            {/* Additional Details (Challan, PO, DC, EWB) */}
            <AdditionalDetails />

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
