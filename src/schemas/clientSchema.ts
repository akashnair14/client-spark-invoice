
import * as z from "zod";
import { Client } from "@/types";

// Client form validation schema
export const clientFormSchema = z.object({
  companyName: z.string().min(2, { message: "Company name is required" }),
  gstNumber: z.string().min(15, { message: "Valid GST number required" }),
  phoneNumber: z.string().min(10, { message: "Valid phone number required" }),
  email: z.string().email({ message: "Valid email required" }),
  bankAccountNumber: z.string().min(1, { message: "Account number required" }),
  bankDetails: z.string().min(1, { message: "Bank details required" }),
  address: z.string().min(1, { message: "Address is required" }),
});

// Type for form values that match the Client type (minus the id)
export type ClientFormValues = z.infer<typeof clientFormSchema>;
