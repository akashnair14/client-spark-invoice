
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
import { supabase } from "@/integrations/supabase/client";

const TemplateDesigner = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('id');
  const isPreviewMode = searchParams.get('preview') === 'true';
  
  const [layout, setLayout] = useState<TemplateLayout | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(!!templateId);
  const [isSaving, setIsSaving] = useState(false);
  const [templateName, setTemplateName] = useState('');

  useEffect(() => {
    checkAuthAndLoadTemplate();
  }, [templateId]);

  const checkAuthAndLoadTemplate = async () => {
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to create or edit templates.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      if (templateId) {
        await loadTemplate();
      }
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "Please log in again to continue.",
        variant: "destructive",
      });
      navigate('/');
    }
  };

  const loadTemplate = async () => {
    if (!templateId) return;
    
    try {
      setIsLoading(true);
      const template = await getInvoiceTemplate(templateId);
      
      setLayout(template.layout_data as unknown as TemplateLayout);
      setTemplateName(template.template_name);
      
      toast({
        title: "Template Loaded",
        description: `Template "${template.template_name}" loaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error Loading Template",
        description: error instanceof Error ? error.message : "Failed to load template. Please try again.",
        variant: "destructive",
      });
      navigate('/templates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (newLayout: TemplateLayout, name?: string) => {
    const finalTemplateName = name || templateName || 'Custom Template';
    
    if (!finalTemplateName.trim()) {
      toast({
        title: "Template Name Required",
        description: "Please provide a name for your template.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);

      // Check authentication again before saving
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const templateData = {
        template_name: finalTemplateName,
        layout_data: newLayout as unknown as any,
        is_default: false,
        is_active: true,
        template_type: 'custom' as const,
        paper_size: 'A4' as const,
        orientation: 'portrait' as const,
        margins: { top: 20, bottom: 20, left: 20, right: 20 } as unknown as any,
      };

      if (templateId) {
        await updateInvoiceTemplate(templateId, templateData);
        toast({
          title: "Template Updated",
          description: `Template "${finalTemplateName}" has been updated successfully.`,
        });
      } else {
        await createInvoiceTemplate(templateData);
        toast({
          title: "Template Saved",
          description: `Template "${finalTemplateName}" has been saved successfully.`,
        });
        navigate('/templates');
      }
    } catch (error) {
      let errorMessage = "Failed to save template. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('User not authenticated')) {
          errorMessage = "Please log in again to save your template.";
        } else if (error.message.includes('violates row-level security')) {
          errorMessage = "You don't have permission to save this template. Please check your account.";
        } else if (error.message.includes('duplicate key')) {
          errorMessage = "A template with this name already exists. Please choose a different name.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Save Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = (currentLayout: TemplateLayout) => {
    setLayout(currentLayout);
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
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
      templateName={templateName}
      onTemplateNameChange={setTemplateName}
      isSaving={isSaving}
    />
  );
};

export default TemplateDesigner;
