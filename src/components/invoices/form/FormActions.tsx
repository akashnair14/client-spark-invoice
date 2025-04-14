
import React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isSubmitting?: boolean;
}

const FormActions = ({ isSubmitting = false }: FormActionsProps) => {
  return (
    <div className="flex justify-end gap-4">
      <Button type="submit" disabled={isSubmitting}>
        Generate Invoice
      </Button>
    </div>
  );
};

export default FormActions;
