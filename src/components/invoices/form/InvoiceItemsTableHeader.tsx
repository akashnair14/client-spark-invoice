
import React from "react";

const InvoiceItemsTableHeader = () => {
  return (
    <thead className="bg-muted">
      <tr className="[&_th]:px-4 [&_th]:py-3 [&_th]:text-left">
        <th className="w-[40%]">Description</th>
        <th className="w-[10%]">Qty</th>
        <th className="w-[15%]">HSN Code</th>
        <th className="w-[15%]">Rate (₹)</th>
        <th className="w-[15%]">Amount (₹)</th>
        <th className="w-[5%]"></th>
      </tr>
    </thead>
  );
};

export default InvoiceItemsTableHeader;
