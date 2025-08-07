import { useState, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplateCanvas } from "./TemplateCanvas";
import { ComponentPalette } from "./ComponentPalette";
import { PropertyPanel } from "./PropertyPanel";
import { TemplatePreview } from "./TemplatePreview";
import { CompanySettingsPanel } from "./CompanySettingsPanel";
import { BrandingPanel } from "./BrandingPanel";
import { InteractivePreview } from "./InteractivePreview";
import { TemplateComponent, TemplateLayout } from "@/types/template";
import { useToast } from "@/hooks/use-toast";
import { Save, Eye, Settings, Palette, Loader2, Building, Play, Download, Printer } from "lucide-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface CompanySettings {
  companyName: string;
  address: string;
  phone: string;
  email: string;
  taxId: string;
  website: string;
  logo?: string;
}

interface TemplateDesignerProps {
  initialLayout?: TemplateLayout;
  onSave?: (layout: TemplateLayout, name?: string) => void;
  onPreview?: (layout: TemplateLayout) => void;
  templateName?: string;
  onTemplateNameChange?: (name: string) => void;
  isPreviewMode?: boolean;
  isSaving?: boolean;
}

export const TemplateDesigner = ({
  initialLayout,
  onSave,
  onPreview,
  templateName = '',
  onTemplateNameChange,
  isPreviewMode = false,
  isSaving = false
}: TemplateDesignerProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("components");
  const [selectedComponent, setSelectedComponent] = useState<TemplateComponent | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'design' | 'interactive'>('design');
  
  const [layout, setLayout] = useState<TemplateLayout>(
    initialLayout || {
      components: [],
      theme: {
        primaryColor: "#3b82f6",
        secondaryColor: "#1e40af",
        textColor: "#1f2937",
        borderColor: "#e5e7eb",
      },
      settings: {
        showBorders: true,
        gridSize: 10,
        snapToGrid: true,
      },
    }
  );

  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    companyName: '',
    address: '',
    phone: '',
    email: '',
    taxId: '',
    website: '',
    logo: '',
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over, delta } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    if (active.id === over.id) {
      setActiveId(null);
      return;
    }

    // Handle component movement
    if (over.id === "canvas") {
      const activeComponent = layout.components.find(c => c.id === active.id);
      if (activeComponent) {
        const newPosition = {
          x: Math.max(0, Math.min(100 - activeComponent.size.width, activeComponent.position.x + (delta.x / 8))),
          y: Math.max(0, Math.min(100 - activeComponent.size.height, activeComponent.position.y + (delta.y / 8))),
        };
        
        updateComponent(activeComponent.id, { position: newPosition });
      }
    }

    setActiveId(null);
  }, [layout.components]);

  const addComponent = useCallback((type: TemplateComponent['type']) => {
    const newComponent: TemplateComponent = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 10, y: 10 },
      size: getDefaultSize(type),
      styles: getDefaultStyles(type),
      isVisible: true,
      isLocked: false,
    };

    // Add type-specific defaults
    if (type === 'invoice-details') {
      newComponent.fields = ['invoiceNumber', 'date', 'dueDate'];
    } else if (type === 'client-info') {
      newComponent.fields = ['companyName', 'address', 'gstNumber'];
    } else if (type === 'company-info') {
      newComponent.fields = ['companyName', 'address', 'phone', 'email'];
    } else if (type === 'bank-details') {
      newComponent.fields = ['bankName', 'accountNumber', 'ifscCode'];
    } else if (type === 'items-table') {
      newComponent.columns = ['description', 'quantity', 'rate', 'amount'];
    } else if (type === 'totals') {
      newComponent.fields = ['subtotal', 'gstAmount', 'total'];
    }

    setLayout(prev => ({
      ...prev,
      components: [...prev.components, newComponent],
    }));

    setSelectedComponent(newComponent);
    
    toast({
      title: "Component Added",
      description: `${type.replace('-', ' ')} component has been added to your template.`,
    });
  }, [toast]);

  const updateComponent = useCallback((id: string, updates: Partial<TemplateComponent>) => {
    setLayout(prev => ({
      ...prev,
      components: prev.components.map(component =>
        component.id === id ? { ...component, ...updates } : component
      ),
    }));

    // Update selected component if it's the one being updated
    if (selectedComponent?.id === id) {
      setSelectedComponent(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [selectedComponent]);

  const removeComponent = useCallback((id: string) => {
    setLayout(prev => ({
      ...prev,
      components: prev.components.filter(component => component.id !== id),
    }));

    if (selectedComponent?.id === id) {
      setSelectedComponent(null);
    }

    toast({
      title: "Component Removed",
      description: "Component has been removed from your template.",
    });
  }, [selectedComponent, toast]);

  const handleSave = useCallback(() => {
    if (!templateName.trim()) {
      toast({
        title: "Template Name Required",
        description: "Please enter a name for your template.",
        variant: "destructive",
      });
      return;
    }
    onSave?.(layout, templateName);
  }, [layout, onSave, templateName, toast]);

  const handlePreview = useCallback(() => {
    if (layout.components.length === 0) {
      toast({
        title: "No Components to Preview",
        description: "Please add at least one component to preview your template.",
        variant: "destructive",
      });
      return;
    }
    onPreview?.(layout);
  }, [layout, onPreview, toast]);

  const handleExportPDF = async (invoiceData: any) => {
    try {
      const element = document.querySelector('.invoice-preview');
      if (!element) return;

      const canvas = await html2canvas(element as HTMLElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`invoice-${invoiceData.invoiceNumber}.pdf`);
      
      toast({
        title: "PDF Generated",
        description: "Invoice has been exported as PDF successfully.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Export Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePrint = (invoiceData: any) => {
    window.print();
    toast({
      title: "Print Dialog Opened",
      description: "Use your browser's print dialog to print the invoice.",
    });
  };

  if (isPreviewMode) {
    return <TemplatePreview layout={layout} />;
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b bg-background p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Invoice Template Designer</h1>
            <div className="flex items-center gap-2">
              <Label htmlFor="template-name" className="text-sm">Template Name:</Label>
              <Input
                id="template-name"
                value={templateName}
                onChange={(e) => onTemplateNameChange?.(e.target.value)}
                placeholder="Enter template name"
                className="w-48"
                disabled={isSaving}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'design' ? 'default' : 'outline'}
              size="sm" 
              onClick={() => setViewMode('design')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Design
            </Button>
            <Button 
              variant={viewMode === 'interactive' ? 'default' : 'outline'}
              size="sm" 
              onClick={() => setViewMode('interactive')}
            >
              <Play className="h-4 w-4 mr-2" />
              Interactive
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePreview}
              disabled={layout.components.length === 0 || isSaving}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button 
              size="sm" 
              onClick={handleSave}
              disabled={!templateName.trim() || isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isSaving ? 'Saving...' : 'Save Template'}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {viewMode === 'interactive' ? (
          <InteractivePreview
            layout={layout}
            companySettings={companySettings}
            onExportPDF={handleExportPDF}
            onPrint={handlePrint}
          />
        ) : (
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToParentElement]}
          >
            {/* Left Sidebar - Component Palette */}
            <div className="w-80 border-r bg-background overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <div className="border-b p-2 flex-shrink-0">
                  <TabsList className="grid w-full grid-cols-2 text-xs">
                    <TabsTrigger value="components" className="text-xs">
                      <Palette className="h-3 w-3 mr-1" />
                      Design
                    </TabsTrigger>
                    <TabsTrigger value="company" className="text-xs">
                      <Building className="h-3 w-3 mr-1" />
                      Settings
                    </TabsTrigger>
                  </TabsList>
                </div>
              
                <div className="flex-1 overflow-y-auto">
                  <TabsContent value="components" className="m-0 h-full">
                    <ComponentPalette onAddComponent={addComponent} />
                  </TabsContent>
                  
                  <TabsContent value="properties" className="m-0 h-full">
                    <PropertyPanel
                      selectedComponent={selectedComponent}
                      onUpdateComponent={updateComponent}
                      onRemoveComponent={removeComponent}
                    />
                  </TabsContent>
                  
                  <TabsContent value="company" className="m-0 h-full">
                    <div className="p-4">
                      <CompanySettingsPanel
                        settings={companySettings}
                        onUpdate={setCompanySettings}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="branding" className="m-0 h-full">
                    <div className="p-4">
                      <BrandingPanel
                        theme={layout.theme}
                        onUpdateTheme={(theme) => setLayout(prev => ({ ...prev, theme }))}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="design" className="m-0 h-full">
                  <div className="p-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Canvas Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Show Grid</span>
                          <Button
                            variant={layout.settings?.showBorders ? "default" : "outline"}
                            size="sm"
                            onClick={() => setLayout(prev => ({
                              ...prev,
                              settings: {
                                ...prev.settings,
                                showBorders: !prev.settings?.showBorders
                              }
                            }))}
                          >
                            {layout.settings?.showBorders ? "On" : "Off"}
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <span className="text-sm">Grid Size</span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setLayout(prev => ({
                                ...prev,
                                settings: {
                                  ...prev.settings,
                                  gridSize: 5
                                }
                              }))}
                            >
                              Fine
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setLayout(prev => ({
                                ...prev,
                                settings: {
                                  ...prev.settings,
                                  gridSize: 10
                                }
                              }))}
                            >
                              Normal
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setLayout(prev => ({
                                ...prev,
                                settings: {
                                  ...prev.settings,
                                  gridSize: 20
                                }
                              }))}
                            >
                              Coarse
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            {/* Main Canvas Area */}
            <div className="flex-1 overflow-auto bg-muted/30">
              <TemplateCanvas
                layout={layout}
                selectedComponent={selectedComponent}
                onSelectComponent={setSelectedComponent}
                onUpdateComponent={updateComponent}
              />
            </div>

            <DragOverlay>
              {activeId ? (
                <div className="bg-primary/20 border-2 border-primary border-dashed rounded p-2">
                  Dragging...
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
};

// Helper functions
const getDefaultSize = (type: TemplateComponent['type']) => {
  switch (type) {
    case 'header':
      return { width: 100, height: 15 };
    case 'logo':
      return { width: 20, height: 15 };
    case 'invoice-details':
    case 'client-info':
    case 'company-info':
      return { width: 45, height: 20 };
    case 'items-table':
      return { width: 100, height: 40 };
    case 'totals':
      return { width: 40, height: 15 };
    case 'payment-terms':
      return { width: 50, height: 12 };
    case 'bank-details':
      return { width: 45, height: 15 };
    case 'notes':
      return { width: 60, height: 10 };
    case 'footer':
      return { width: 100, height: 8 };
    case 'watermark':
      return { width: 30, height: 30 };
    case 'barcode':
      return { width: 25, height: 8 };
    case 'signature':
      return { width: 30, height: 10 };
    case 'qr-code':
      return { width: 15, height: 15 };
    case 'line-separator':
      return { width: 100, height: 2 };
    case 'text-block':
      return { width: 40, height: 10 };
    default:
      return { width: 30, height: 10 };
  }
};

const getDefaultStyles = (type: TemplateComponent['type']) => {
  const baseStyles = {
    fontSize: '12px',
    fontFamily: 'system-ui',
    color: 'hsl(var(--foreground))',
  };

  switch (type) {
    case 'header':
      return {
        ...baseStyles,
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center' as const,
      };
    case 'footer':
      return {
        ...baseStyles,
        fontSize: '10px',
        textAlign: 'center' as const,
        color: 'hsl(var(--muted-foreground))',
      };
    case 'totals':
      return {
        ...baseStyles,
        textAlign: 'right' as const,
        fontWeight: '500',
      };
    case 'payment-terms':
    case 'bank-details':
      return {
        ...baseStyles,
        fontSize: '11px',
      };
    case 'notes':
      return {
        ...baseStyles,
        fontSize: '10px',
        color: 'hsl(var(--muted-foreground))',
      };
    case 'watermark':
      return {
        ...baseStyles,
        fontSize: '48px',
        color: '#f0f0f0',
        fontWeight: 'bold',
      };
    case 'line-separator':
      return {
        borderColor: '#000000',
        borderWidth: '1px',
        borderStyle: 'solid',
      };
    default:
      return baseStyles;
  }
};
