import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import PageSEO from "@/components/seo/PageSEO";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCompanyProfile, CompanyProfile } from "@/hooks/useCompanyProfile";
import { Building2, MapPin, FileText, Phone, Globe, Landmark, Save, Loader2 } from "lucide-react";
import PremiumLoader from "@/components/ui/PremiumLoader";

const fieldGroups = [
  {
    title: "Company Information",
    icon: Building2,
    description: "Your company name and branding details that appear on invoices.",
    fields: [
      { key: "company_name", label: "Company Name", placeholder: "Acme Pvt. Ltd." },
      { key: "full_name", label: "Owner / Contact Name", placeholder: "John Doe" },
      { key: "company_gst_number", label: "GST Number (GSTIN)", placeholder: "27AAPFU0939F1ZV" },
    ],
  },
  {
    title: "Address",
    icon: MapPin,
    description: "Your registered company address shown on invoices.",
    fields: [
      { key: "company_address", label: "Street Address", placeholder: "123 Business Street" },
      { key: "company_city", label: "City", placeholder: "Mumbai" },
      { key: "company_state", label: "State", placeholder: "Maharashtra" },
      { key: "company_postal_code", label: "Postal Code", placeholder: "400001" },
    ],
  },
  {
    title: "Contact Details",
    icon: Phone,
    description: "Contact information displayed on your invoices.",
    fields: [
      { key: "company_email", label: "Business Email", placeholder: "billing@company.com" },
      { key: "company_phone", label: "Business Phone", placeholder: "+91-9876543210" },
      { key: "company_website", label: "Website", placeholder: "www.company.com" },
    ],
  },
  {
    title: "Bank Details",
    icon: Landmark,
    description: "Bank information for receiving payments (shown on invoices).",
    fields: [
      { key: "company_bank_name", label: "Bank Name", placeholder: "HDFC Bank" },
      { key: "company_bank_account", label: "Account Number", placeholder: "50100123456789" },
      { key: "company_bank_ifsc", label: "IFSC Code", placeholder: "HDFC0001234" },
    ],
  },
];

const Settings: React.FC = () => {
  const { profile, isLoading, updateProfile, isUpdating } = useCompanyProfile();
  const { toast } = useToast();
  const [form, setForm] = useState<CompanyProfile>(profile);

  useEffect(() => {
    setForm(profile);
  }, [profile]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await updateProfile(form);
      toast({
        title: "Profile Saved",
        description: "Your company details have been updated. They'll now appear on all invoices.",
      });
    } catch (err: any) {
      toast({
        title: "Save Failed",
        description: err.message || "Could not save profile.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <Layout><PremiumLoader variant="inline" /></Layout>;

  return (
    <Layout>
      <PageSEO
        title="Company Settings | SparkInvoice"
        description="Manage your company details, address, and bank information for invoices."
        canonicalUrl={window.location.origin + "/settings"}
      />
      <div className="pb-4 space-y-5 md:space-y-6 max-w-3xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Company Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">
            These details will appear on all your invoices
          </p>
        </div>

        {fieldGroups.map((group, gi) => (
          <Card key={group.title} className="border-border/40 animate-fade-in" style={{ animationDelay: `${gi * 80}ms` }}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <group.icon className="h-4.5 w-4.5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">{group.title}</CardTitle>
                  <CardDescription className="text-xs">{group.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {group.fields.map((field) => (
                  <div key={field.key} className={field.key === "company_address" ? "sm:col-span-2" : ""}>
                    <Label htmlFor={field.key} className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      {field.label}
                    </Label>
                    <Input
                      id={field.key}
                      value={(form as any)[field.key] || ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="bg-surface-1"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} disabled={isUpdating} size="lg" className="gap-2 min-w-[160px]">
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isUpdating ? "Saving…" : "Save Settings"}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
