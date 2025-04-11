
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Client, InvoiceItem } from "@/types";
import { calculateSubtotal, calculateGstAmount, calculateTotalAmount } from "@/utils/invoiceUtils";
import InvoiceDetails from "./form/InvoiceDetails";
import InvoiceItemsTable from "./form/InvoiceItemsTable";
import InvoiceTotals from "./form/InvoiceTotals";
import InvoiceNotes from "./form/InvoiceNotes";

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
  const [subtotal, setSubtotal] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [total, setTotal] = useState(0);

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

  useEffect(() => {
    if (initialClientId) {
      form.setValue("clientId", initialClientId);
    }
  }, [initialClientId, form]);

  const watchItems = form.watch("items");

  // Update totals whenever items change
  useEffect(() => {
    const updateTotals = () => {
      // Calculate amounts for each item first
      const updatedItems = watchItems.map(item => ({
        ...item,
        amount: item.quantity * item.rate
      }));
      
      // Update each item's amount in the form
      updatedItems.forEach((item, index) => {
        if (form.getValues(`items.${index}.amount`) !== item.amount) {
          form.setValue(`items.${index}.amount`, item.amount);
        }
      });
      
      // Make sure all items have required properties
      const validItems: InvoiceItem[] = updatedItems
        .filter(item => 
          item && 
          typeof item.quantity === 'number' && 
          typeof item.rate === 'number' &&
          item.id !== undefined
        )
        .map(item => ({
          id: item.id || '',
          description: item.description || '',
          quantity: item.quantity || 0,
          hsnCode: item.hsnCode || '',
          rate: item.rate || 0,
          gstRate: item.gstRate || 0,
          amount: item.amount || 0
        }));
      
      // Calculate subtotal
      const newSubtotal = calculateSubtotal(validItems);
      setSubtotal(newSubtotal);

      // Calculate GST amount
      const newGstAmount = calculateGstAmount(validItems);
      setGstAmount(newGstAmount);

      // Calculate total
      setTotal(newSubtotal + newGstAmount);
    };

    updateTotals();
  }, [watchItems, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // Calculate final amounts to ensure they're up to date
    const updatedItems = values.items.map(item => ({
      ...item,
      amount: item.quantity * item.rate
    }));
    
    const validItems: InvoiceItem[] = updatedItems.map(item => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      hsnCode: item.hsnCode,
      rate: item.rate,
      gstRate: item.gstRate,
      amount: item.amount
    }));
    
    const updatedValues = {
      ...values,
      items: validItems,
    };
    
    onSubmit(updatedValues);
  };

  const handleQuantityOrRateChange = (index: number) => {
    const items = form.getValues("items");
    const item = items[index];
    
    if (item.quantity && item.rate) {
      const amount = item.quantity * item.rate;
      form.setValue(`items.${index}.amount`, amount);
    }
  };

  return (
    <div className="space-y-8 mb-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Client and Invoice Details */}
          <InvoiceDetails clients={clients} />

          {/* Invoice Items */}
          <InvoiceItemsTable handleQuantityOrRateChange={handleQuantityOrRateChange} />

          {/* Totals */}
          <InvoiceTotals 
            subtotal={subtotal} 
            gstAmount={gstAmount} 
            total={total}
          />

          {/* Notes */}
          <InvoiceNotes />

          <div className="flex justify-end gap-4">
            <Button type="submit">Generate Invoice</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default InvoiceForm;
