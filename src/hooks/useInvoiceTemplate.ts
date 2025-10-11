import { useState, useEffect } from "react";
import { TemplateLayout } from "@/types/template";
import { getInvoiceTemplate, getInvoiceTemplates, InvoiceTemplate } from "@/api/invoiceTemplates";
import { useToast } from "@/hooks/use-toast";

export const useInvoiceTemplate = () => {
  const { toast } = useToast();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [templateLayout, setTemplateLayout] = useState<TemplateLayout | null>(null);
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    if (selectedTemplateId) {
      loadTemplateLayout(selectedTemplateId);
    } else {
      setTemplateLayout(null);
    }
  }, [selectedTemplateId]);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const data = await getInvoiceTemplates();
      setTemplates(data);

      // Auto-select default template if none selected
      if (!selectedTemplateId) {
        const defaultTemplate = data.find(t => t.is_default);
        if (defaultTemplate) {
          setSelectedTemplateId(defaultTemplate.id);
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

  const loadTemplateLayout = async (templateId: string) => {
    try {
      const template = await getInvoiceTemplate(templateId);
      if (template.layout_data) {
        setTemplateLayout(template.layout_data as unknown as TemplateLayout);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load template layout.",
        variant: "destructive",
      });
    }
  };

  const selectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
  };

  const isCustomTemplate = templateLayout && templateLayout.components.length > 0;

  return {
    selectedTemplateId,
    templateLayout,
    templates,
    isLoading,
    isCustomTemplate,
    selectTemplate,
    refreshTemplates: loadTemplates,
  };
};