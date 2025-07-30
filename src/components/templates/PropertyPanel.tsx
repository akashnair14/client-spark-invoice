import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TemplateComponent } from "@/types/template";
import { Trash2, Move, Palette, Type, Settings } from "lucide-react";

interface PropertyPanelProps {
  selectedComponent: TemplateComponent | null;
  onUpdateComponent: (id: string, updates: Partial<TemplateComponent>) => void;
  onRemoveComponent: (id: string) => void;
}

export const PropertyPanel = ({
  selectedComponent,
  onUpdateComponent,
  onRemoveComponent,
}: PropertyPanelProps) => {
  const [activeTab, setActiveTab] = useState("position");

  if (!selectedComponent) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No component selected</p>
              <p className="text-xs">Click on a component to edit its properties</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const updateComponent = (updates: Partial<TemplateComponent>) => {
    onUpdateComponent(selectedComponent.id, updates);
  };

  const updateStyles = (styleUpdates: Partial<TemplateComponent['styles']>) => {
    updateComponent({
      styles: { ...selectedComponent.styles, ...styleUpdates }
    });
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm capitalize">
                {selectedComponent.type.replace('-', ' ')}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                ID: {selectedComponent.id}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveComponent(selectedComponent.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="position" className="text-xs">
                <Move className="h-3 w-3 mr-1" />
                Position
              </TabsTrigger>
              <TabsTrigger value="style" className="text-xs">
                <Palette className="h-3 w-3 mr-1" />
                Style
              </TabsTrigger>
              <TabsTrigger value="content" className="text-xs">
                <Type className="h-3 w-3 mr-1" />
                Content
              </TabsTrigger>
            </TabsList>

            <TabsContent value="position" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Position</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      <Label className="text-xs text-muted-foreground">X (%)</Label>
                      <Input
                        type="number"
                        value={selectedComponent.position.x}
                        onChange={(e) => updateComponent({
                          position: {
                            ...selectedComponent.position,
                            x: Math.max(0, Math.min(100, Number(e.target.value)))
                          }
                        })}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Y (%)</Label>
                      <Input
                        type="number"
                        value={selectedComponent.position.y}
                        onChange={(e) => updateComponent({
                          position: {
                            ...selectedComponent.position,
                            y: Math.max(0, Math.min(100, Number(e.target.value)))
                          }
                        })}
                        className="h-8"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Size</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      <Label className="text-xs text-muted-foreground">Width (%)</Label>
                      <Input
                        type="number"
                        value={selectedComponent.size.width}
                        onChange={(e) => updateComponent({
                          size: {
                            ...selectedComponent.size,
                            width: Math.max(5, Math.min(100, Number(e.target.value)))
                          }
                        })}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Height (%)</Label>
                      <Input
                        type="number"
                        value={selectedComponent.size.height}
                        onChange={(e) => updateComponent({
                          size: {
                            ...selectedComponent.size,
                            height: Math.max(5, Math.min(100, Number(e.target.value)))
                          }
                        })}
                        className="h-8"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="style" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Font Size</Label>
                  <Select
                    value={selectedComponent.styles.fontSize || '12px'}
                    onValueChange={(value) => updateStyles({ fontSize: value })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8px">8px</SelectItem>
                      <SelectItem value="10px">10px</SelectItem>
                      <SelectItem value="12px">12px</SelectItem>
                      <SelectItem value="14px">14px</SelectItem>
                      <SelectItem value="16px">16px</SelectItem>
                      <SelectItem value="18px">18px</SelectItem>
                      <SelectItem value="20px">20px</SelectItem>
                      <SelectItem value="24px">24px</SelectItem>
                      <SelectItem value="28px">28px</SelectItem>
                      <SelectItem value="32px">32px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Font Weight</Label>
                  <Select
                    value={selectedComponent.styles.fontWeight || 'normal'}
                    onValueChange={(value) => updateStyles({ fontWeight: value })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="500">Medium</SelectItem>
                      <SelectItem value="600">Semi Bold</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Text Alignment</Label>
                  <Select
                    value={selectedComponent.styles.textAlign || 'left'}
                    onValueChange={(value) => updateStyles({ textAlign: value as any })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Text Color</Label>
                  <Input
                    type="color"
                    value={selectedComponent.styles.color || '#000000'}
                    onChange={(e) => updateStyles({ color: e.target.value })}
                    className="h-8 w-full"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4 mt-4">
              {selectedComponent.fields && (
                <div>
                  <Label className="text-xs">Visible Fields</Label>
                  <div className="mt-2 space-y-1">
                    {getAvailableFields(selectedComponent.type).map((field) => (
                      <div key={field.key} className="flex items-center justify-between">
                        <Label className="text-xs">{field.label}</Label>
                        <Badge 
                          variant={selectedComponent.fields?.includes(field.key) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const currentFields = selectedComponent.fields || [];
                            const newFields = currentFields.includes(field.key)
                              ? currentFields.filter(f => f !== field.key)
                              : [...currentFields, field.key];
                            updateComponent({ fields: newFields });
                          }}
                        >
                          {selectedComponent.fields?.includes(field.key) ? "Shown" : "Hidden"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedComponent.columns && (
                <div>
                  <Label className="text-xs">Table Columns</Label>
                  <div className="mt-2 space-y-1">
                    {getAvailableColumns().map((column) => (
                      <div key={column.key} className="flex items-center justify-between">
                        <Label className="text-xs">{column.label}</Label>
                        <Badge 
                          variant={selectedComponent.columns?.includes(column.key) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const currentColumns = selectedComponent.columns || [];
                            const newColumns = currentColumns.includes(column.key)
                              ? currentColumns.filter(c => c !== column.key)
                              : [...currentColumns, column.key];
                            updateComponent({ columns: newColumns });
                          }}
                        >
                          {selectedComponent.columns?.includes(column.key) ? "Shown" : "Hidden"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedComponent.type === 'header' && (
                <div>
                  <Label className="text-xs">Header Text</Label>
                  <Input
                    value={selectedComponent.data?.title || ''}
                    onChange={(e) => updateComponent({
                      data: { ...selectedComponent.data, title: e.target.value }
                    })}
                    placeholder="Enter header text"
                    className="h-8 mt-1"
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xs">Component Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Visible</Label>
            <Button
              variant={selectedComponent.isVisible ? "default" : "outline"}
              size="sm"
              onClick={() => updateComponent({ isVisible: !selectedComponent.isVisible })}
            >
              {selectedComponent.isVisible ? "Shown" : "Hidden"}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <Label className="text-xs">Locked</Label>
            <Button
              variant={selectedComponent.isLocked ? "default" : "outline"}
              size="sm"
              onClick={() => updateComponent({ isLocked: !selectedComponent.isLocked })}
            >
              {selectedComponent.isLocked ? "Locked" : "Unlocked"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const getAvailableFields = (type: TemplateComponent['type']) => {
  switch (type) {
    case 'invoice-details':
      return [
        { key: 'invoiceNumber', label: 'Invoice Number' },
        { key: 'date', label: 'Invoice Date' },
        { key: 'dueDate', label: 'Due Date' },
        { key: 'challanNumber', label: 'Challan Number' },
        { key: 'poNumber', label: 'PO Number' },
      ];
    case 'client-info':
      return [
        { key: 'companyName', label: 'Company Name' },
        { key: 'contactName', label: 'Contact Name' },
        { key: 'address', label: 'Address' },
        { key: 'gstNumber', label: 'GST Number' },
        { key: 'phone', label: 'Phone' },
        { key: 'email', label: 'Email' },
      ];
    case 'totals':
      return [
        { key: 'subtotal', label: 'Subtotal' },
        { key: 'gstAmount', label: 'GST Amount' },
        { key: 'roundoff', label: 'Round Off' },
        { key: 'total', label: 'Total' },
      ];
    default:
      return [];
  }
};

const getAvailableColumns = () => [
  { key: 'description', label: 'Description' },
  { key: 'hsnCode', label: 'HSN Code' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'rate', label: 'Rate' },
  { key: 'gstRate', label: 'GST Rate' },
  { key: 'amount', label: 'Amount' },
];