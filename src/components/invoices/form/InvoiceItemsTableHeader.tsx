
import React from "react";

const InvoiceItemsTableHeader = () => {
  return (
    <thead className="bg-muted">
      <tr className="[&_th]:px-4 [&_th]:py-3 [&_th]:text-left">
        <th className="w-[30%]">Description</th>
        <th className="w-[8%]">Qty</th>
        <th className="w-[10%]">HSN Code</th>
        <th className="w-[10%]">Rate (₹)</th>
        <th className="w-[8%]">GST %</th>
        <th className="w-[8%]">CGST %</th>
        <th className="w-[8%]">SGST %</th>
        <th className="w-[10%]">Amount (₹)</th>
        <th className="w-[3%]"></th>
      </tr>
    </thead>
  );
};

export default InvoiceItemsTableHeader;
