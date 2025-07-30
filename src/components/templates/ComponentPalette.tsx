import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComponentDefinition, TemplateComponent } from "@/types/template";
import {
  FileText,
  Building,
  User,
  Table,
  Calculator,
  StickyNote,
  Image,
  PenTool,
  QrCode,
  Plus,
} from "lucide-react";

interface ComponentPaletteProps {
  onAddComponent: (type: TemplateComponent['type']) => void;
}

const componentDefinitions: ComponentDefinition[] = [
  {
    type: 'header',
    label: 'Header',
    icon: 'FileText',
    defaultSize: { width: 100, height: 15 },
    defaultStyles: { fontSize: '24px', fontWeight: 'bold', textAlign: 'center' },
    configurable: { styles: true, data: true },
    description: 'Invoice title and company branding'
  },
  {
    type: 'logo',
    label: 'Company Logo',
    icon: 'Image',
    defaultSize: { width: 20, height: 15 },
    defaultStyles: {},
    configurable: { data: true },
    description: 'Upload and display company logo'
  },
  {
    type: 'invoice-details',
    label: 'Invoice Details',
    icon: 'FileText',
    defaultSize: { width: 45, height: 20 },
    defaultStyles: { fontSize: '12px' },
    configurable: { fields: true, styles: true },
    description: 'Invoice number, date, due date, etc.'
  },
  {
    type: 'client-info',
    label: 'Client Information',
    icon: 'User',
    defaultSize: { width: 45, height: 20 },
    defaultStyles: { fontSize: '12px' },
    configurable: { fields: true, styles: true },
    description: 'Client name, address, GST number'
  },
  {
    type: 'items-table',
    label: 'Items Table',
    icon: 'Table',
    defaultSize: { width: 100, height: 40 },
    defaultStyles: { fontSize: '11px' },
    configurable: { columns: true, styles: true },
    description: 'Line items with quantities and prices'
  },
  {
    type: 'totals',
    label: 'Totals Section',
    icon: 'Calculator',
    defaultSize: { width: 40, height: 15 },
    defaultStyles: { fontSize: '12px', textAlign: 'right' },
    configurable: { fields: true, styles: true },
    description: 'Subtotal, tax, and total amounts'
  },
  {
    type: 'notes',
    label: 'Notes & Terms',
    icon: 'StickyNote',
    defaultSize: { width: 60, height: 10 },
    defaultStyles: { fontSize: '10px' },
    configurable: { styles: true, data: true },
    description: 'Payment terms and additional notes'
  },
  {
    type: 'signature',
    label: 'Signature',
    icon: 'PenTool',
    defaultSize: { width: 30, height: 10 },
    defaultStyles: {},
    configurable: { data: true },
    description: 'Authorized signature area'
  },
  {
    type: 'qr-code',
    label: 'QR Code',
    icon: 'QrCode',
    defaultSize: { width: 15, height: 15 },
    defaultStyles: {},
    configurable: { data: true },
    description: 'QR code for digital verification'
  },
];

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'FileText': return FileText;
    case 'Building': return Building;
    case 'User': return User;
    case 'Table': return Table;
    case 'Calculator': return Calculator;
    case 'StickyNote': return StickyNote;
    case 'Image': return Image;
    case 'PenTool': return PenTool;
    case 'QrCode': return QrCode;
    default: return FileText;
  }
};

export const ComponentPalette = ({ onAddComponent }: ComponentPaletteProps) => {
  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Invoice Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-muted-foreground mb-4">
            Drag components onto the canvas or click to add them.
          </p>
          
          {componentDefinitions.map((component) => {
            const IconComponent = getIcon(component.icon);
            
            return (
              <div
                key={component.type}
                className="group relative"
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto p-3 hover:bg-accent"
                  onClick={() => onAddComponent(component.type)}
                >
                  <div className="flex items-start gap-3 w-full">
                    <IconComponent className="h-5 w-5 mt-0.5 text-primary" />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{component.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {component.description}
                      </div>
                      <div className="flex gap-1 mt-1">
                        {component.configurable.fields && (
                          <Badge variant="secondary" className="text-xs">Fields</Badge>
                        )}
                        {component.configurable.columns && (
                          <Badge variant="secondary" className="text-xs">Columns</Badge>
                        )}
                        {component.configurable.styles && (
                          <Badge variant="secondary" className="text-xs">Styles</Badge>
                        )}
                      </div>
                    </div>
                    <Plus className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Click to add components to canvas</li>
            <li>• Drag components to reposition them</li>
            <li>• Select components to edit properties</li>
            <li>• Use data tokens like {{invoice.total}}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};