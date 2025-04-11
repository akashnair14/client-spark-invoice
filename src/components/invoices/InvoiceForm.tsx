
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Client, InvoiceItem, GST_RATES } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Plus, Trash } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchItems = form.watch("items");

  useEffect(() => {
    const updateTotals = () => {
      // Calculate subtotal
      const newSubtotal = watchItems.reduce((total, item) => {
        return total + item.quantity * item.rate;
      }, 0);
      setSubtotal(newSubtotal);

      // Calculate GST amount
      const newGstAmount = watchItems.reduce((total, item) => {
        return total + (item.quantity * item.rate * item.gstRate) / 100;
      }, 0);
      setGstAmount(newGstAmount);

      // Calculate total
      setTotal(newSubtotal + newGstAmount);
    };

    updateTotals();
  }, [watchItems]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const updatedValues = {
      ...values,
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select
                    onValueChange={field.onChange}
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

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
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

          {/* Invoice Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Invoice Items</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  append({
                    id: uuidv4(),
                    description: "",
                    quantity: 1,
                    hsnCode: "",
                    rate: 0,
                    gstRate: 18,
                    amount: 0,
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Item
              </Button>
            </div>

            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr className="[&_th]:px-4 [&_th]:py-3 [&_th]:text-left">
                    <th className="w-[40%]">Description</th>
                    <th className="w-[10%]">Qty</th>
                    <th className="w-[15%]">HSN Code</th>
                    <th className="w-[12%]">Rate (₹)</th>
                    <th className="w-[10%]">GST %</th>
                    <th className="w-[10%]">Amount (₹)</th>
                    <th className="w-[3%]"></th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field, index) => (
                    <tr key={field.id} className="border-b">
                      <td className="p-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.description`}
                          render={({ field }) => (
                            <FormControl>
                              <Input {...field} placeholder="Description" />
                            </FormControl>
                          )}
                        />
                      </td>
                      <td className="p-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.quantity`}
                          render={({ field }) => (
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min="1"
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleQuantityOrRateChange(index);
                                }}
                              />
                            </FormControl>
                          )}
                        />
                      </td>
                      <td className="p-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.hsnCode`}
                          render={({ field }) => (
                            <FormControl>
                              <Input {...field} placeholder="HSN" />
                            </FormControl>
                          )}
                        />
                      </td>
                      <td className="p-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.rate`}
                          render={({ field }) => (
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min="0"
                                step="0.01"
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleQuantityOrRateChange(index);
                                }}
                              />
                            </FormControl>
                          )}
                        />
                      </td>
                      <td className="p-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.gstRate`}
                          render={({ field }) => (
                            <FormControl>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(parseInt(value));
                                }}
                                defaultValue={field.value.toString()}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {GST_RATES.map((rate) => (
                                    <SelectItem
                                      key={rate}
                                      value={rate.toString()}
                                    >
                                      {rate}%
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                          )}
                        />
                      </td>
                      <td className="p-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.amount`}
                          render={({ field }) => (
                            <FormControl>
                              <Input
                                {...field}
                                readOnly
                                className="bg-muted cursor-not-allowed"
                              />
                            </FormControl>
                          )}
                        />
                      </td>
                      <td className="p-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={fields.length === 1}
                          onClick={() => remove(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex flex-col items-end space-y-2">
              <div className="flex items-center w-full max-w-md justify-between">
                <span className="font-medium">Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center w-full max-w-md justify-between">
                <span className="font-medium">GST:</span>
                <span>₹{gstAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center w-full max-w-md justify-between text-lg font-bold">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Add any additional notes here..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="submit">Generate Invoice</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default InvoiceForm;
