
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GST_RATES } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash } from "lucide-react";
import { useInvoiceItems } from "@/hooks/useInvoiceItems";

const InvoiceItemsTable = () => {
  const form = useFormContext();
  const { handleQuantityOrRateChange } = useInvoiceItems(form);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  return (
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
              <th className="w-[35%]">Description</th>
              <th className="w-[10%]">Qty</th>
              <th className="w-[12%]">HSN Code</th>
              <th className="w-[10%]">Rate (₹)</th>
              <th className="w-[10%]">GST %</th>
              <th className="w-[8%]">CGST</th>
              <th className="w-[8%]">SGST</th>
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
                            // Force recalculation after GST rate change
                            setTimeout(() => handleQuantityOrRateChange(index), 0);
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
                <td className="p-2 text-center">
                  {form.watch(`items.${index}.rate`) && form.watch(`items.${index}.quantity`) && form.watch(`items.${index}.gstRate`) ? 
                    `${(form.watch(`items.${index}.gstRate`) / 2)}%` : "-"}
                </td>
                <td className="p-2 text-center">
                  {form.watch(`items.${index}.rate`) && form.watch(`items.${index}.quantity`) && form.watch(`items.${index}.gstRate`) ? 
                    `${(form.watch(`items.${index}.gstRate`) / 2)}%` : "-"}
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
                          value={`₹${field.value.toFixed(2)}`}
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
    </div>
  );
};

export default InvoiceItemsTable;
