import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TemplateDesigner as TemplateDesignerComponent } from "@/components/templates/TemplateDesigner";
import { TemplatePreview } from "@/components/templates/TemplatePreview";
import { TemplateLayout } from "@/types/template";
import { useToast } from "@/hooks/use-toast";
import { 
  createInvoiceTemplate, 
  updateInvoiceTemplate, 
  getInvoiceTemplate 
} from "@/api/invoiceTemplates";

const TemplateDesigner = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('id');
  const isPreviewMode = searchParams.get('preview') === 'true';
  
  const [layout, setLayout] = useState<TemplateLayout | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(!!templateId);
  const [templateName, setTemplateName] = useState('');

  useEffect(() => {
    if (templateId) {
      loadTemplate();
    }
  }, [templateId]);

  const loadTemplate = async () => {
    if (!templateId) return;
    
    try {
      setIsLoading(true);
      const template = await getInvoiceTemplate(templateId);
      setLayout(template.layout_data as TemplateLayout);
      setTemplateName(template.template_name);
    } catch (error) {
      console.error('Failed to load template:', error);
      toast({
        title: "Error",
        description: "Failed to load template. Please try again.",
        variant: "destructive",
      });
      navigate('/templates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (newLayout: TemplateLayout) => {
    try {
      const templateData = {
        template_name: templateName || 'Custom Template',
        layout_data: newLayout,
        is_default: false,
        is_active: true,
        template_type: 'custom' as const,
        paper_size: 'A4' as const,
        orientation: 'portrait' as const,
        margins: { top: 20, bottom: 20, left: 20, right: 20 },
      };

      if (templateId) {
        await updateInvoiceTemplate(templateId, templateData);
        toast({
          title: "Template Updated",
          description: "Your template has been updated successfully.",
        });
      } else {
        await createInvoiceTemplate(templateData);
        toast({
          title: "Template Saved",
          description: "Your template has been saved successfully.",
        });
        navigate('/templates');
      }
    } catch (error) {
      console.error('Failed to save template:', error);
      toast({
        title: "Error",
        description: "Failed to save template. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePreview = () => {
    const params = new URLSearchParams(searchParams);
    params.set('preview', 'true');
    navigate(`/templates/designer?${params.toString()}`);
  };

  const handleBackToDesigner = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('preview');
    navigate(`/templates/designer?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Loading template...</div>
          <div className="text-sm text-muted-foreground">Please wait</div>
        </div>
      </div>
    );
  }

  if (isPreviewMode && layout) {
    return <TemplatePreview layout={layout} onBack={handleBackToDesigner} />;
  }

  return (
    <TemplateDesignerComponent
      initialLayout={layout}
      onSave={handleSave}
      onPreview={handlePreview}
    />
  );
};

export default TemplateDesigner;