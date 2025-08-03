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
import { TemplateComponent, TemplateLayout } from "@/types/template";
import { useToast } from "@/hooks/use-toast";
import { Save, Eye, Settings, Palette } from "lucide-react";

interface TemplateDesignerProps {
  initialLayout?: TemplateLayout;
  onSave?: (layout: TemplateLayout, name?: string) => void;
  onPreview?: (layout: TemplateLayout) => void;
  templateName?: string;
  onTemplateNameChange?: (name: string) => void;
  isPreviewMode?: boolean;
}

export const TemplateDesigner = ({
  initialLayout,
  onSave,
  onPreview,
  templateName = '',
  onTemplateNameChange,
  isPreviewMode = false
}: TemplateDesignerProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("components");
  const [selectedComponent, setSelectedComponent] = useState<TemplateComponent | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const [layout, setLayout] = useState<TemplateLayout>(
    initialLayout || {
      components: [],
      theme: {
        primaryColor: "hsl(var(--primary))",
        secondaryColor: "hsl(var(--secondary))",
        textColor: "hsl(var(--foreground))",
        borderColor: "hsl(var(--border))",
      },
      settings: {
        showBorders: true,
        gridSize: 10,
        snapToGrid: true,
      },
    }
  );

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
    } else if (type === 'items-table') {
      newComponent.columns = ['description', 'quantity', 'rate', 'amount'];
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
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onPreview?.(layout)}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Template
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToParentElement]}
        >
          {/* Left Sidebar - Component Palette */}
          <div className="w-80 border-r bg-background">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <div className="border-b p-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="components">
                    <Palette className="h-4 w-4 mr-2" />
                    Components
                  </TabsTrigger>
                  <TabsTrigger value="properties">
                    <Settings className="h-4 w-4 mr-2" />
                    Properties
                  </TabsTrigger>
                  <TabsTrigger value="design">
                    Design
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
      return { width: 45, height: 20 };
    case 'items-table':
      return { width: 100, height: 40 };
    case 'totals':
      return { width: 40, height: 15 };
    case 'notes':
      return { width: 60, height: 10 };
    case 'signature':
      return { width: 30, height: 10 };
    case 'qr-code':
      return { width: 15, height: 15 };
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
    case 'totals':
      return {
        ...baseStyles,
        textAlign: 'right' as const,
        fontWeight: '500',
      };
    case 'notes':
      return {
        ...baseStyles,
        fontSize: '10px',
        color: 'hsl(var(--muted-foreground))',
      };
    default:
      return baseStyles;
  }
};