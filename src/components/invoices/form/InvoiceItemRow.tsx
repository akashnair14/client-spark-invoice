
import React from "react";
import { useFormContext } from "react-hook-form";
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
import { Trash } from "lucide-react";
import { useInvoiceItems } from "@/hooks/useInvoiceItems";

interface InvoiceItemRowProps {
  index: number;
  remove: (index: number) => void;
  disableRemove: boolean;
}

const InvoiceItemRow = ({ index, remove, disableRemove }: InvoiceItemRowProps) => {
  const form = useFormContext();
  const { 
    handleQuantityOrRateChange, 
    handleGstRateChange,
    handleCgstSgstChange 
  } = useInvoiceItems(form);

  return (
    <tr className="border-b">
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
                  const value = parseFloat(e.target.value) || 0;
                  field.onChange(value);
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
                  const value = parseFloat(e.target.value) || 0;
                  field.onChange(value);
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
              <Input
                {...field}
                type="number"
                min="0"
                step="0.01"
                className="w-full"
                onChange={(e) => {
                  const newRate = parseFloat(e.target.value) || 0;
                  field.onChange(newRate);
                  handleGstRateChange(index, newRate);
                }}
              />
            </FormControl>
          )}
        />
      </td>
      <td className="p-2">
        <FormField
          control={form.control}
          name={`items.${index}.cgstRate`}
          render={({ field }) => (
            <FormControl>
              <Input
                {...field}
                type="number"
                min="0"
                step="0.01"
                className="w-full"
                onChange={(e) => {
                  const newRate = parseFloat(e.target.value) || 0;
                  field.onChange(newRate);
                  handleCgstSgstChange(index);
                }}
              />
            </FormControl>
          )}
        />
      </td>
      <td className="p-2">
        <FormField
          control={form.control}
          name={`items.${index}.sgstRate`}
          render={({ field }) => (
            <FormControl>
              <Input
                {...field}
                type="number"
                min="0"
                step="0.01"
                className="w-full"
                onChange={(e) => {
                  const newRate = parseFloat(e.target.value) || 0;
                  field.onChange(newRate);
                  handleCgstSgstChange(index);
                }}
              />
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
                value={`₹${Number(field.value).toFixed(2)}`}
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
          disabled={disableRemove}
          onClick={() => remove(index)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
};

export default InvoiceItemRow;
