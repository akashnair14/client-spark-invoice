
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resendLoading: boolean;
  onResend: () => void;
  onOk: () => void;
  lastRegisteredEmail: string;
  email: string;
}

const ConfirmEmailDialog: React.FC<ConfirmEmailDialogProps> = ({
  open,
  onOpenChange,
  resendLoading,
  onResend,
  onOk,
  lastRegisteredEmail,
  email,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-sm">
      <DialogHeader>
        <DialogTitle className="text-lg text-blue-800 dark:text-blue-200 font-semibold text-center">
          Confirm your email
        </DialogTitle>
      </DialogHeader>
      <div className="py-2 text-center text-blue-900 dark:text-blue-100">
        We've sent a confirmation email.<br />
        <span className="font-semibold">Please confirm your email and then log in to get started.</span>
      </div>
      <div className="flex flex-col items-center mt-3">
        <Button
          variant="secondary"
          className="w-full mb-2"
          onClick={onResend}
          disabled={resendLoading || !(lastRegisteredEmail || email)}
          type="button"
        >
          {resendLoading ? (
            <span className="animate-spin mr-2 w-4 h-4 border-2 rounded-full border-blue-400 border-t-transparent inline-block"></span>
          ) : null}
          Resend confirmation email
        </Button>
        <Button
          className="w-full"
          onClick={onOk}
          autoFocus
        >
          Ok
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

export default ConfirmEmailDialog;
