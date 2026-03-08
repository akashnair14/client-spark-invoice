import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface CompanyProfile {
  company_name: string;
  company_address: string;
  company_city: string;
  company_state: string;
  company_postal_code: string;
  company_gst_number: string;
  company_email: string;
  company_phone: string;
  company_website: string;
  company_logo_url: string;
  company_bank_name: string;
  company_bank_account: string;
  company_bank_ifsc: string;
  full_name: string;
  phone: string;
  avatar_url: string;
}

const defaultProfile: CompanyProfile = {
  company_name: "",
  company_address: "",
  company_city: "",
  company_state: "",
  company_postal_code: "",
  company_gst_number: "",
  company_email: "",
  company_phone: "",
  company_website: "",
  company_logo_url: "",
  company_bank_name: "",
  company_bank_account: "",
  company_bank_ifsc: "",
  full_name: "",
  phone: "",
  avatar_url: "",
};

export function useCompanyProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["company-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return defaultProfile;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (error) throw error;
      if (!data) return defaultProfile;
      return {
        company_name: (data as any).company_name || "",
        company_address: (data as any).company_address || "",
        company_city: (data as any).company_city || "",
        company_state: (data as any).company_state || "",
        company_postal_code: (data as any).company_postal_code || "",
        company_gst_number: (data as any).company_gst_number || "",
        company_email: (data as any).company_email || "",
        company_phone: (data as any).company_phone || "",
        company_website: (data as any).company_website || "",
        company_logo_url: (data as any).company_logo_url || "",
        company_bank_name: (data as any).company_bank_name || "",
        company_bank_account: (data as any).company_bank_account || "",
        company_bank_ifsc: (data as any).company_bank_ifsc || "",
        full_name: data.full_name || "",
        phone: data.phone || "",
        avatar_url: data.avatar_url || "",
      } satisfies CompanyProfile;
    },
    enabled: !!user?.id,
  });

  const mutation = useMutation({
    mutationFn: async (updates: Partial<CompanyProfile>) => {
      if (!user?.id) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("profiles")
        .update(updates as any)
        .eq("id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-profile"] });
    },
  });

  return {
    profile: query.data ?? defaultProfile,
    isLoading: query.isLoading,
    error: query.error,
    updateProfile: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
}
