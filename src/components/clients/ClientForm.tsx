import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Client } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ClientFormValues, clientFormSchema } from "@/schemas/clientSchema";
import ClientFormFields from "./ClientFormFields";

interface ClientFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Client, "id">) => void;
  initialData?: Client;
}

const ClientForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
}: ClientFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: initialData || {
      companyName: "",
      gstNumber: "",
      phoneNumber: "",
      email: "",
      bankAccountNumber: "",
      bankDetails: "",
      address: "",
    },
  });

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        // Skip the 'id' field since it's not part of the form
        if (key !== 'id') {
          const value = initialData[key as keyof Client];
          // Ensure we only set string values for form fields
          if (typeof value === 'string') {
            form.setValue(key as keyof ClientFormValues, value);
          }
        }
      });
    } else {
      // Reset form when not editing
      form.reset({
        companyName: "",
        gstNumber: "",
        phoneNumber: "",
        email: "",
        bankAccountNumber: "",
        bankDetails: "",
        address: "",
      });
    }
  }, [initialData, form, open]);

  const handleSubmit = async (values: ClientFormValues) => {
    try {
      setIsLoading(true);
      // Now values is guaranteed to contain all required fields for the Client type
      onSubmit(values as Omit<Client, "id">);
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Safe close handler that ensures form state is properly reset
  const handleClose = () => {
    onClose();
    // Reset form on close with a delay to prevent UI flicker
    setTimeout(() => {
      if (!initialData) {
        form.reset();
      }
    }, 100);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Client" : "Add New Client"}
          </DialogTitle>
          <DialogDescription>
            {initialData ? "Update client information" : "Add a new client to your list"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 pt-2"
          >
            <ClientFormFields form={form} />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {initialData ? "Update Client" : "Add Client"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientForm;
