import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CompanySettings {
  companyName: string;
  address: string;
  phone: string;
  email: string;
  taxId: string;
  website: string;
  logo?: string;
}

interface CompanySettingsPanelProps {
  settings: CompanySettings;
  onUpdate: (settings: CompanySettings) => void;
}

export const CompanySettingsPanel = ({ settings, onUpdate }: CompanySettingsPanelProps) => {
  const { toast } = useToast();
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleInputChange = (field: keyof CompanySettings, value: string) => {
    onUpdate({
      ...settings,
      [field]: value,
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleInputChange('logo', event.target.result as string);
          toast({
            title: "Logo uploaded",
            description: "Your company logo has been updated",
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    handleInputChange('logo', '');
    toast({
      title: "Logo removed",
      description: "Company logo has been removed",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Company Logo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.logo ? (
            <div className="relative">
              <img
                src={settings.logo}
                alt="Company Logo"
                className="max-w-32 max-h-32 object-contain border border-border rounded"
              />
              <Button
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 p-0"
                onClick={removeLogo}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">Upload your company logo</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />
              <Label htmlFor="logo-upload" className="cursor-pointer">
                <Button size="sm" variant="outline" asChild>
                  <span>Choose File</span>
                </Button>
              </Label>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Company Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name" className="text-xs">Company Name</Label>
            <Input
              id="company-name"
              value={settings.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="Your Company Name"
              className="h-8 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-xs">Address</Label>
            <Textarea
              id="address"
              value={settings.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Company Address"
              className="min-h-16 text-sm resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs">Phone</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 10) {
                    handleInputChange('phone', value);
                  }
                }}
                placeholder="10-digit mobile number"
                className="h-8 text-sm"
                maxLength={10}
              />
              {settings.phone && settings.phone.length !== 10 && (
                <p className="text-xs text-destructive">Phone number must be 10 digits</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="company@example.com"
                className="h-8 text-sm"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              />
              {settings.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email) && (
                <p className="text-xs text-destructive">Please enter a valid email address</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="tax-id" className="text-xs">Tax ID/GST</Label>
              <Input
                id="tax-id"
                value={settings.taxId}
                onChange={(e) => handleInputChange('taxId', e.target.value)}
                placeholder="Tax ID Number"
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="text-xs">Website</Label>
              <Input
                id="website"
                value={settings.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="www.company.com"
                className="h-8 text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};