
import { Invoice } from "@/types";
import jsPDF from "jspdf";

export function downloadInvoicesAsCSV(invoices: Invoice[]) {
  if (!invoices.length) return;
  const header = [
    "Invoice Number",
    "Date",
    "Status",
    "Subtotal",
    "GST Amount",
    "Total"
  ];
  const rows = invoices.map(inv => [
    inv.invoiceNumber,
    inv.date,
    inv.status,
    inv.subtotal,
    inv.gstAmount,
    inv.total
  ]);
  const csvContent = [header, ...rows]
    .map(row => row.map(String).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "invoices.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function downloadInvoicesAsPDF(invoices: Invoice[]) {
  if (!invoices.length) return;
  const doc = new jsPDF();
  doc.text("Invoices List", 10, 10);

  const cellPadding = 2;
  const colWidths = [35, 25, 22, 23, 23, 23];
  let y = 20;
  const headers = ["Invoice #", "Date", "Status", "Subtotal", "GST", "Total"];
  // Header
  headers.forEach((h, i) =>
    doc.text(h, 10 + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y)
  );
  y += 8;
  invoices.forEach((inv, idx) => {
    const row = [
      inv.invoiceNumber,
      inv.date,
      inv.status,
      inv.subtotal.toString(),
      inv.gstAmount.toString(),
      inv.total.toString()
    ];
    row.forEach((cell, i) =>
      doc.text(String(cell), 10 + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y)
    );
    y += 7;
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save("invoices.pdf");
}
