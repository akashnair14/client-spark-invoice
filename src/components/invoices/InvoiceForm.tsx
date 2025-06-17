
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
import InvoiceTotals from "./form/InvoiceTotals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
  const [isRecordSaved, setIsRecordSaved] = useState(false);
  const [sectionsOpen, setSectionsOpen] = useState({
    clientInfo: true,
    additionalInfo: false,
    items: true,
    taxSummary: true,
    notes: false
  });
  const { toast } = useToast();

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

  // Watch for client selection and update the selectedClient state
  const watchedClientId = form.watch("clientId");
  useEffect(() => {
    if (watchedClientId) {
      const client = clients.find(c => c.id === watchedClientId);
      setSelectedClient(client);
    }
  }, [watchedClientId, clients]);

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

  const handleSaveRecord = async () => {
    const formValues = form.getValues();
    
    // Validate required fields for saving
    if (!formValues.clientId || !formValues.invoiceNumber) {
      toast({
        title: "Missing Information",
        description: "Please select a client and enter an invoice number to save record.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create invoice record with status 'draft'
      const invoiceRecord = {
        id: uuidv4(),
        clientId: formValues.clientId,
        date: formValues.date.toISOString(),
        dueDate: formValues.date.toISOString(), // Default due date same as invoice date
        invoiceNumber: formValues.invoiceNumber,
        items: formValues.items.map(item => ({
          ...item,
          amount: item.quantity * item.rate
        })),
        subtotal: formValues.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0),
        gstAmount: formValues.items.reduce((sum, item) => sum + (item.quantity * item.rate * item.gstRate / 100), 0),
        total: formValues.items.reduce((sum, item) => {
          const itemTotal = item.quantity * item.rate;
          const itemGst = itemTotal * item.gstRate / 100;
          return sum + itemTotal + itemGst;
        }, 0),
        status: 'draft' as const,
        notes: formValues.notes,
        gstType: formValues.gstType,
        challanNumber: formValues.challanNumber,
        challanDate: formValues.challanDate?.toISOString() || null,
        poNumber: formValues.poNumber,
        poDate: formValues.poDate?.toISOString() || null,
        dcNumber: formValues.dcNumber,
        dcDate: formValues.dcDate?.toISOString() || null,
        ewbNumber: formValues.ewbNumber,
        lastStatusUpdate: new Date().toISOString()
      };

      // Store in localStorage for now (will be replaced with backend integration)
      const existingInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
      const updatedInvoices = [...existingInvoices.filter((inv: any) => inv.invoiceNumber !== formValues.invoiceNumber), invoiceRecord];
      localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
      
      setIsRecordSaved(true);
      
      toast({
        title: "Record Saved",
        description: `Invoice ${formValues.invoiceNumber} has been saved successfully.`,
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save invoice record. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleSection = (section: keyof typeof sectionsOpen) => {
    setSectionsOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const isFormValid = form.formState.isValid && selectedClient !== undefined;

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
              </div>
            }
          >
            {/* Client Information Section */}
            <Card>
              <Collapsible 
                open={sectionsOpen.clientInfo}
                onOpenChange={() => toggleSection('clientInfo')}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      Client Information
                      {sectionsOpen.clientInfo ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <EnhancedInvoiceDetails
                      clients={clients}
                      initialClientId={initialClientId}
                    />
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Additional Details Section */}
            <Card>
              <Collapsible 
                open={sectionsOpen.additionalInfo}
                onOpenChange={() => toggleSection('additionalInfo')}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      Additional Information
                      {sectionsOpen.additionalInfo ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <AdditionalDetails />
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Invoice Items Section */}
            <Card>
              <Collapsible 
                open={sectionsOpen.items}
                onOpenChange={() => toggleSection('items')}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      Invoice Items
                      {sectionsOpen.items ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <InvoiceItemsTable />
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Tax Summary Section */}
            <Card>
              <Collapsible 
                open={sectionsOpen.taxSummary}
                onOpenChange={() => toggleSection('taxSummary')}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      Tax & Totals
                      {sectionsOpen.taxSummary ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <InvoiceTotals />
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Notes Section */}
            <Card>
              <Collapsible 
                open={sectionsOpen.notes}
                onOpenChange={() => toggleSection('notes')}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      Notes & Terms
                      {sectionsOpen.notes ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <InvoiceNotes />
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Sticky Action Buttons */}
            <div className="sticky bottom-0 bg-background border-t pt-4 mt-8">
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleSaveRecord}
                  disabled={form.formState.isSubmitting}
                >
                  Save Record
                </Button>
                
                <Button
                  type="submit"
                  disabled={!isFormValid || form.formState.isSubmitting || !isRecordSaved}
                >
                  Generate Invoice
                </Button>
              </div>
            </div>
          </InvoiceFormLayout>
        </form>
      </Form>
    </InvoiceFormProvider>
  );
};

export default InvoiceForm;
