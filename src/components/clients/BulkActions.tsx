
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
import { MoreHorizontal, Trash2, Mail, Download, Users } from "lucide-react";
import { Client } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface BulkActionsProps {
  selectedClients: string[];
  onSelectionChange: (clientIds: string[]) => void;
  clients: Client[];
  onBulkDelete: (clientIds: string[]) => void;
}

const BulkActions = ({
  selectedClients,
  onSelectionChange,
  clients,
  onBulkDelete,
}: BulkActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const allSelected = clients.length > 0 && selectedClients.length === clients.length;
  const someSelected = selectedClients.length > 0 && selectedClients.length < clients.length;

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(clients.map(client => client.id));
    }
  };

  const handleBulkDelete = () => {
    onBulkDelete(selectedClients);
    onSelectionChange([]);
    setShowDeleteDialog(false);
    toast({
      title: "Clients Deleted",
      description: `${selectedClients.length} client(s) have been deleted successfully.`,
    });
  };

  const handleSendReminders = () => {
    toast({
      title: "Reminders Sent",
      description: `Reminders sent to ${selectedClients.length} client(s).`,
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: `Exporting data for ${selectedClients.length} client(s).`,
    });
  };

  if (clients.length === 0) return null;

  return (
    <div className="flex items-center gap-4 py-2">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={allSelected}
          ref={(el) => {
            if (el) el.indeterminate = someSelected;
          }}
          onCheckedChange={handleSelectAll}
        />
        <span className="text-sm text-muted-foreground">
          {selectedClients.length > 0 ? (
            `${selectedClients.length} of ${clients.length} selected`
          ) : (
            `Select all ${clients.length} clients`
          )}
        </span>
      </div>

      {selectedClients.length > 0 && (
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Users className="h-4 w-4" />
                Actions ({selectedClients.length})
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSendReminders} className="gap-2">
                <Mail className="h-4 w-4" />
                Send Reminders
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportData} className="gap-2">
                <Download className="h-4 w-4" />
                Export Data
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
            <AlertDialogTitle>Delete Selected Clients</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedClients.length} client(s)? 
              This action cannot be undone and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleBulkDelete}
            >
              Delete {selectedClients.length} Client(s)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BulkActions;
