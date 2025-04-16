
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';
import AddItemButton from "./AddItemButton";
import InvoiceItemsTableHeader from "./InvoiceItemsTableHeader";
import InvoiceItemRow from "./InvoiceItemRow";
import { useInvoiceForm } from "@/context/InvoiceFormContext";

const InvoiceItemsTable = () => {
  const form = useFormContext();
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const handleAddItem = () => {
    append({
      id: uuidv4(),
      description: "",
      quantity: 1,
      hsnCode: "",
      rate: 0,
      gstRate: 18,
      cgstRate: 9,
      sgstRate: 9,
      amount: 0,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Invoice Items</h3>
        <AddItemButton onAddItem={handleAddItem} />
      </div>

      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-sm">
          <InvoiceItemsTableHeader />
          <tbody>
            {fields.map((field, index) => (
              <InvoiceItemRow 
                key={field.id} 
                index={index} 
                remove={remove}
                disableRemove={fields.length === 1}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceItemsTable;
