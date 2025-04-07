
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
          form.setValue(key as keyof ClientFormValues, initialData[key as keyof Client]);
        }
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: ClientFormValues) => {
    try {
      setIsLoading(true);
      // Now values is guaranteed to contain all required fields for the Client type
      onSubmit(values as Omit<Client, "id">);
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Client" : "Add New Client"}
          </DialogTitle>
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
                onClick={onClose}
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
