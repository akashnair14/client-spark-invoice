import { Invoice, Client } from "@/types";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

// Note: Pass client/company details to the Excel/PDF export functions
export function downloadInvoicesAsExcel(invoices: Invoice[], clientDetails?: Partial<Client>) {
  if (!invoices.length) return;

  // Company info (if provided)
  const companyInfo = clientDetails
    ? [
        ["Company Name", clientDetails.companyName || ""],
        ["GST Number", clientDetails.gstNumber || ""],
        ["Address", clientDetails.address || ""],
        ["City", clientDetails.city || ""],
        ["State", clientDetails.state || ""],
        ["Postal Code", clientDetails.postalCode || ""],
        ["Email", clientDetails.email || ""],
        ["Phone Number", clientDetails.phoneNumber || ""],
      ]
    : [];

  // Main header row
  const header = [
    "Invoice Number",
    "Date",
    "Status",
    "Subtotal",
    "GST Amount",
    "Total"
  ];

  // Invoice rows
  const rows = invoices.map(inv => [
    inv.invoiceNumber,
    inv.date,
    inv.status,
    inv.subtotal,
    inv.gstAmount,
    inv.total
  ]);

  // Combine: add company info first, then a blank row, then invoice table.
  const excelData =
    companyInfo.length > 0
      ? [...companyInfo, [], header, ...rows]
      : [header, ...rows];

  // Create sheet & workbook
  const ws = XLSX.utils.aoa_to_sheet(excelData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Invoices");

  // Export as xlsx file
  XLSX.writeFile(wb, "invoices.xlsx");
}

// Update: Accept client/company details for export
export function downloadInvoicesAsPDF(invoices: Invoice[], clientDetails?: Partial<Client>) {
  if (!invoices.length) return;
  const doc = new jsPDF();

  let y = 12;

  // Add company info if available
  if (clientDetails) {
    doc.setFontSize(14);
    doc.text(clientDetails.companyName || "Company", 10, y);
    y += 7;
    doc.setFontSize(10);
    if (clientDetails.gstNumber) {
      doc.text(`GST: ${clientDetails.gstNumber}`, 10, y);
      y += 6;
    }
    let addressParts: string[] = [];
    if (clientDetails.address) addressParts.push(clientDetails.address);
    if (clientDetails.city) addressParts.push(clientDetails.city);
    if (clientDetails.state) addressParts.push(clientDetails.state);
    if (clientDetails.postalCode) addressParts.push(clientDetails.postalCode);
    if (addressParts.length > 0) {
      doc.text(addressParts.join(", "), 10, y);
      y += 6;
    }
    if (clientDetails.email) {
      doc.text(`Email: ${clientDetails.email}`, 10, y);
      y += 6;
    }
    if (clientDetails.phoneNumber) {
      doc.text(`Phone: ${clientDetails.phoneNumber}`, 10, y);
      y += 6;
    }
    y += 2;
  }

  doc.setFontSize(13);
  doc.text("Invoices List", 10, y);
  y += 8;

  const cellPadding = 2;
  const colWidths = [35, 25, 22, 23, 23, 23];
  const headers = ["Invoice #", "Date", "Status", "Subtotal", "GST", "Total"];
  // Header
  headers.forEach((h, i) =>
    doc.text(h, 10 + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y)
  );
  y += 8;
  doc.setFontSize(11);
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

// Legacy CSV export (kept for compatibility, but not used for Excel button)
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
