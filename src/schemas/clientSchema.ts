
import * as z from "zod";
import { Client } from "@/types";

const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const phoneRegex = /^[0-9]{10,15}$/;
const accountNumberRegex = /^[0-9]{6,18}$/;

// Client form validation schema
export const clientFormSchema = z.object({
  companyName: z.string().trim().min(2, { message: "Company name must be at least 2 characters" }).max(150, { message: "Company name is too long" }),
  gstNumber: z.string().trim()
    .transform(v => v === "" ? undefined : v.toUpperCase())
    .pipe(
      z.string().regex(gstRegex, { message: "Invalid GST format (e.g. 22AAAAA0000A1Z5)" }).optional()
    )
    .optional()
    .default(""),
  phoneNumber: z.string().trim()
    .transform(v => v.replace(/[\s\-()]+/g, ""))
    .pipe(
      z.string().regex(phoneRegex, { message: "Phone must be 10-15 digits" }).or(z.literal(""))
    )
    .optional()
    .default(""),
  email: z.string().trim()
    .transform(v => v === "" ? undefined : v.toLowerCase())
    .pipe(
      z.string().email({ message: "Invalid email address" }).optional()
    )
    .optional()
    .default(""),
  bankAccountNumber: z.string().trim()
    .pipe(
      z.string().regex(accountNumberRegex, { message: "Account number must be 6-18 digits" }).or(z.literal(""))
    )
    .optional()
    .default(""),
  bankDetails: z.string().trim().max(500, { message: "Bank details too long" }).optional().default(""),
  address: z.string().trim().max(500, { message: "Address is too long" }).optional().default(""),
});

// Type for form values that match the Client type (minus the id)
export type ClientFormValues = z.infer<typeof clientFormSchema>;
