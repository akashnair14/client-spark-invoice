
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Trash2, Mail, Download, FileText, CheckCircle2 } from "lucide-react";
import { Invoice } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface InvoiceBulkActionsProps {
  selectedInvoices: string[];
  onSelectionChange: (invoiceIds: string[]) => void;
  invoices: Invoice[];
  onBulkDelete: (invoiceIds: string[]) => void;
  onBulkStatusUpdate: (invoiceIds: string[], status: Invoice['status']) => void;
}

const InvoiceBulkActions = ({
  selectedInvoices,
  onSelectionChange,
  invoices,
  onBulkDelete,
  onBulkStatusUpdate,
}: InvoiceBulkActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const allSelected = invoices.length > 0 && selectedInvoices.length === invoices.length;
  const someSelected = selectedInvoices.length > 0 && selectedInvoices.length < invoices.length;

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(invoices.map(invoice => invoice.id));
    }
  };

  const handleBulkDelete = () => {
    onBulkDelete(selectedInvoices);
    onSelectionChange([]);
    setShowDeleteDialog(false);
    toast({
      title: "Invoices Deleted",
      description: `${selectedInvoices.length} invoice(s) have been deleted successfully.`,
    });
  };

  const handleMarkAsPaid = () => {
    onBulkStatusUpdate(selectedInvoices, 'paid');
    toast({
      title: "Status Updated",
      description: `${selectedInvoices.length} invoice(s) marked as paid.`,
    });
  };

  const handleSendReminders = () => {
    toast({
      title: "Reminders Sent",
      description: `Reminders sent for ${selectedInvoices.length} invoice(s).`,
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: `Exporting ${selectedInvoices.length} invoice(s).`,
    });
  };

  if (invoices.length === 0) return null;

  return (
    <div className="flex items-center gap-4 py-2">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={allSelected}
          indeterminate={someSelected}
          onCheckedChange={handleSelectAll}
        />
        <span className="text-sm text-muted-foreground">
          {selectedInvoices.length > 0 ? (
            `${selectedInvoices.length} of ${invoices.length} selected`
          ) : (
            `Select all ${invoices.length} invoices`
          )}
        </span>
      </div>

      {selectedInvoices.length > 0 && (
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <FileText className="h-4 w-4" />
                Actions ({selectedInvoices.length})
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleMarkAsPaid} className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Mark as Paid
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSendReminders} className="gap-2">
                <Mail className="h-4 w-4" />
                Send Reminders
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportData} className="gap-2">
                <Download className="h-4 w-4" />
                Export Selected
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setShowDeleteDialog(true)}
                className="gap-2 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectionChange([])}
          >
            Clear Selection
          </Button>
        </div>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Invoices</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedInvoices.length} invoice(s)? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleBulkDelete}
            >
              Delete {selectedInvoices.length} Invoice(s)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InvoiceBulkActions;
