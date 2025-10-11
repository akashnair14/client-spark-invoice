import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getInvoiceTemplates, InvoiceTemplate } from "@/api/invoiceTemplates";
import { useToast } from "@/hooks/use-toast";
import { FileText, Settings, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TemplateSelectorProps {
  selectedTemplateId?: string;
  onTemplateSelect: (templateId: string) => void;
}

export const TemplateSelector = ({
  selectedTemplateId,
  onTemplateSelect,
}: TemplateSelectorProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const data = await getInvoiceTemplates();
      setTemplates(data);
      
      // If no template is selected, auto-select the default one
      if (!selectedTemplateId) {
        const defaultTemplate = data.find(t => t.is_default);
        if (defaultTemplate) {
          onTemplateSelect(defaultTemplate.id);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load invoice templates.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Invoice Template</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Invoice Template</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/templates')}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Select value={selectedTemplateId} onValueChange={onTemplateSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            {templates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{template.template_name}</span>
                  {template.is_default && (
                    <Badge variant="outline" className="text-xs">
                      Default
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedTemplate && (
          <div className="text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Type: {selectedTemplate.template_type}</span>
              <Badge variant="outline" className="text-xs">
                {selectedTemplate.paper_size}
              </Badge>
            </div>
            <div className="mt-1">
              Components: {(selectedTemplate.layout_data as any)?.components?.length || 0}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => navigate('/templates/designer')}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
          {selectedTemplate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/templates/designer?id=${selectedTemplate.id}`)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};