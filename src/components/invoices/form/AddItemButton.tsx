
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

interface AddItemButtonProps {
  onAddItem: () => void;
}

const AddItemButton = ({ onAddItem }: AddItemButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onAddItem}
    >
      <Plus className="h-4 w-4 mr-1" /> Add Item
    </Button>
  );
};

export default AddItemButton;
