import { describe, it, expect } from "vitest";
import { mapDbClient, mapDbInvoice, mapDbInvoiceItem, clientToDbFields } from "@/utils/transformers";

describe("mapDbClient", () => {
  it("transforms a database row into a Client object", () => {
    const dbRow = {
      id: "abc-123",
      company_name: "Acme Corp",
      contact_name: "John Doe",
      gst_number: "GST123",
      phone_number: "+91-9999999999",
      email: "john@acme.com",
      bank_account_number: "1234567890",
      bank_details: "HDFC Bank",
      address: "123 Street",
      city: "Mumbai",
      state: "Maharashtra",
      postal_code: "400001",
      website: "acme.com",
      tags: ["premium"],
      status: "active",
      last_invoice_date: "2025-01-15",
      total_invoiced: 50000,
      pending_invoices: 2,
      fy_invoices: 5,
    };

    const result = mapDbClient(dbRow);

    expect(result.id).toBe("abc-123");
    expect(result.companyName).toBe("Acme Corp");
    expect(result.contactName).toBe("John Doe");
    expect(result.gstNumber).toBe("GST123");
    expect(result.phoneNumber).toBe("+91-9999999999");
    expect(result.email).toBe("john@acme.com");
    expect(result.city).toBe("Mumbai");
    expect(result.tags).toEqual(["premium"]);
    expect(result.totalInvoiced).toBe(50000);
  });

  it("handles null/missing values with defaults", () => {
    const dbRow = {
      id: "xyz",
      company_name: "Test Co",
    };

    const result = mapDbClient(dbRow);

    expect(result.companyName).toBe("Test Co");
    expect(result.contactName).toBe("");
    expect(result.email).toBe("");
    expect(result.tags).toEqual([]);
    expect(result.totalInvoiced).toBeUndefined();
  });
});

describe("mapDbInvoiceItem", () => {
  it("transforms a database invoice item row", () => {
    const item = {
      id: "item-1",
      description: "Widget",
      hsn_code: "8471",
      quantity: "5",
      rate: "100.50",
      gst_rate: "18",
      cgst_rate: "9",
      sgst_rate: "9",
      amount: "502.50",
    };

    const result = mapDbInvoiceItem(item);

    expect(result.description).toBe("Widget");
    expect(result.quantity).toBe(5);
    expect(result.rate).toBe(100.5);
    expect(result.gstRate).toBe(18);
    expect(result.amount).toBe(502.5);
  });
});

describe("mapDbInvoice", () => {
  it("transforms a database invoice with nested items", () => {
    const dbInvoice = {
      id: "inv-1",
      invoice_number: "INV-001",
      client_id: "client-1",
      clients: { company_name: "Acme Corp" },
      date: "2025-01-15",
      due_date: "2025-02-15",
      total: "10000",
      subtotal: "8474.58",
      gst_amount: "1525.42",
      status: "paid",
      gst_type: "intra-state",
      notes: "Thank you",
      last_status_update: "2025-01-20",
      invoice_items: [
        { id: "i1", description: "Service", hsn_code: "", quantity: 1, rate: 8474.58, gst_rate: 18, cgst_rate: 9, sgst_rate: 9, amount: 8474.58 },
      ],
    };

    const result = mapDbInvoice(dbInvoice);

    expect(result.invoiceNumber).toBe("INV-001");
    expect(result.clientName).toBe("Acme Corp");
    expect(result.total).toBe(10000);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].description).toBe("Service");
  });
});

describe("clientToDbFields", () => {
  it("converts Client fields to database column names", () => {
    const client = {
      companyName: "Test Co",
      contactName: "Jane",
      gstNumber: "GST456",
      phoneNumber: "+91-1111111111",
      phone: "+91-1111111111",
      email: "jane@test.com",
      bankAccountNumber: "999",
      bankDetails: "SBI",
      address: "456 Ave",
      city: "Delhi",
      state: "Delhi",
      postalCode: "110001",
      website: "test.com",
      tags: ["new"],
      status: "active" as const,
    };

    const result = clientToDbFields(client);

    expect(result.company_name).toBe("Test Co");
    expect(result.phone_number).toBe("+91-1111111111");
    expect(result.postal_code).toBe("110001");
  });
});
