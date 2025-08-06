import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TemplateTheme } from "@/types/template";

interface BrandingPanelProps {
  theme: TemplateTheme;
  onUpdateTheme: (theme: TemplateTheme) => void;
}

const FONT_FAMILIES = [
  { value: 'system-ui', label: 'System UI' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
];

const COLOR_PRESETS = [
  { name: 'Professional Blue', primary: '#3b82f6', secondary: '#1e40af', text: '#1f2937' },
  { name: 'Corporate Gray', primary: '#374151', secondary: '#6b7280', text: '#111827' },
  { name: 'Modern Green', primary: '#10b981', secondary: '#047857', text: '#1f2937' },
  { name: 'Elegant Purple', primary: '#8b5cf6', secondary: '#7c3aed', text: '#1f2937' },
  { name: 'Classic Red', primary: '#dc2626', secondary: '#b91c1c', text: '#1f2937' },
  { name: 'Orange Accent', primary: '#ea580c', secondary: '#c2410c', text: '#1f2937' },
];

export const BrandingPanel = ({ theme, onUpdateTheme }: BrandingPanelProps) => {
  const handleColorChange = (field: keyof TemplateTheme, value: string) => {
    onUpdateTheme({
      ...theme,
      [field]: value,
    });
  };

  const applyColorPreset = (preset: typeof COLOR_PRESETS[0]) => {
    onUpdateTheme({
      ...theme,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      textColor: preset.text,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Color Presets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2">
            {COLOR_PRESETS.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                onClick={() => applyColorPreset(preset)}
                className="justify-start h-auto p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: preset.secondary }}
                    />
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: preset.text }}
                    />
                  </div>
                  <span className="text-xs">{preset.name}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Custom Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primary-color" className="text-xs">Primary Color</Label>
            <div className="flex gap-2">
              <input
                id="primary-color"
                type="color"
                value={theme.primaryColor}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                className="w-8 h-8 rounded border border-border cursor-pointer"
              />
              <div className="flex-1 text-xs text-muted-foreground py-2">
                {theme.primaryColor}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondary-color" className="text-xs">Secondary Color</Label>
            <div className="flex gap-2">
              <input
                id="secondary-color"
                type="color"
                value={theme.secondaryColor}
                onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                className="w-8 h-8 rounded border border-border cursor-pointer"
              />
              <div className="flex-1 text-xs text-muted-foreground py-2">
                {theme.secondaryColor}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="text-color" className="text-xs">Text Color</Label>
            <div className="flex gap-2">
              <input
                id="text-color"
                type="color"
                value={theme.textColor}
                onChange={(e) => handleColorChange('textColor', e.target.value)}
                className="w-8 h-8 rounded border border-border cursor-pointer"
              />
              <div className="flex-1 text-xs text-muted-foreground py-2">
                {theme.textColor}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="border-color" className="text-xs">Border Color</Label>
            <div className="flex gap-2">
              <input
                id="border-color"
                type="color"
                value={theme.borderColor}
                onChange={(e) => handleColorChange('borderColor', e.target.value)}
                className="w-8 h-8 rounded border border-border cursor-pointer"
              />
              <div className="flex-1 text-xs text-muted-foreground py-2">
                {theme.borderColor}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Typography</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="font-family" className="text-xs">Font Family</Label>
            <Select
              value={theme.accentColor || 'system-ui'}
              onValueChange={(value) => handleColorChange('accentColor', value)}
            >
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                {FONT_FAMILIES.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    <span style={{ fontFamily: font.value }}>{font.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};