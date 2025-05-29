
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { v4 as uuidv4 } from 'uuid';
import { Form } from "@/components/ui/form";
import { Client } from "@/types";
import { InvoiceFormProvider } from "@/context/InvoiceFormContext";
import InvoiceItemsTable from "./form/InvoiceItemsTable";
import InvoiceNotes from "./form/InvoiceNotes";
import AdditionalDetails from "./form/AdditionalDetails";
import InvoiceFormLayout from "./form/InvoiceFormLayout";
import StickySummary from "./form/StickySummary";
import EnhancedInvoiceDetails from "./form/EnhancedInvoiceDetails";
import InvoiceActions from "./form/InvoiceActions";
import InvoicePreviewPane from "./form/InvoicePreviewPane";
import { useInvoiceForm } from "@/context/InvoiceFormContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [selectedClient, setSelectedClient] = useState<Client | undefined>();
  const [showPreview, setShowPreview] = useState(false);

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

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
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

  const handleSaveDraft = () => {
    console.log("Saving as draft...");
    // Implement draft save logic
  };

  const handleSaveAndShare = () => {
    console.log("Saving and sharing...");
    // Implement save and share logic
  };

  const handleSaveAndPrint = () => {
    console.log("Saving and printing...");
    // Implement save and print logic
  };

  const handlePreview = () => {
    setShowPreview(!showPreview);
  };

  const isFormValid = form.formState.isValid && selectedClient;

  return (
    <InvoiceFormProvider>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <InvoiceFormLayout
            sidebar={
              <div className="space-y-4">
                <StickySummary
                  selectedClient={selectedClient}
                  invoiceNumber={form.watch("invoiceNumber")}
                  date={form.watch("date")}
                />
                {showPreview && (
                  <InvoicePreviewComponent 
                    client={selectedClient}
                    form={form}
                  />
                )}
              </div>
            }
          >
            {/* Enhanced Invoice Details */}
            <EnhancedInvoiceDetails
              clients={clients}
              onClientSelect={setSelectedClient}
            />

            {/* Additional Details */}
            <AdditionalDetails />

            {/* Invoice Items */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice Items</CardTitle>
              </CardHeader>
              <CardContent>
                <InvoiceItemsTable />
              </CardContent>
            </Card>

            {/* Notes */}
            <InvoiceNotes />

            {/* Action Buttons */}
            <InvoiceActions
              onSaveDraft={handleSaveDraft}
              onSaveAndShare={handleSaveAndShare}
              onSaveAndPrint={handleSaveAndPrint}
              onPreview={handlePreview}
              isValid={isFormValid}
              isSubmitting={form.formState.isSubmitting}
            />
          </InvoiceFormLayout>
        </form>
      </Form>
    </InvoiceFormProvider>
  );
};

// Helper component to access context
const InvoicePreviewComponent = ({ client, form }: { client?: Client; form: any }) => {
  const { subtotal, gstAmount, total, gstType } = useInvoiceForm();
  
  return (
    <InvoicePreviewPane
      client={client}
      invoiceNumber={form.watch("invoiceNumber")}
      date={form.watch("date")}
      items={form.watch("items")}
      subtotal={subtotal}
      gstAmount={gstAmount}
      total={total}
      gstType={form.watch("gstType")}
    />
  );
};

export default InvoiceForm;
