
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Save, Send, Printer, FileText, Share2, Eye } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface InvoiceActionsProps {
  onSaveDraft: () => void;
  onSaveAndShare: () => void;
  onSaveAndPrint: () => void;
  onPreview: () => void;
  isValid: boolean;
  isSubmitting?: boolean;
}

const InvoiceActions = ({ 
  onSaveDraft, 
  onSaveAndShare, 
  onSaveAndPrint, 
  onPreview, 
  isValid,
  isSubmitting = false 
}: InvoiceActionsProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onPreview}
            disabled={!isValid || isSubmitting}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          
          <Separator orientation="vertical" className="hidden sm:block h-8" />
          
          <Button
            type="button"
            variant="secondary"
            onClick={onSaveDraft}
            disabled={isSubmitting}
            className="flex-1"
          >
            <Save className="h-4 w-4 mr-2" />
            Save as Draft
          </Button>
          
          <Button
            type="button"
            variant="default"
            onClick={onSaveAndShare}
            disabled={!isValid || isSubmitting}
            className="flex-1"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Save & Share
          </Button>
          
          <Button
            type="button"
            variant="default"
            onClick={onSaveAndPrint}
            disabled={!isValid || isSubmitting}
            className="flex-1"
          >
            <Printer className="h-4 w-4 mr-2" />
            Save & Print
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceActions;
