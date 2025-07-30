export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          address: string | null
          bank_account_number: string | null
          bank_details: string | null
          city: string | null
          company_name: string
          contact_name: string | null
          created_at: string | null
          email: string | null
          fy_invoices: number | null
          gst_number: string | null
          id: string
          last_invoice_date: string | null
          owner_id: string
          pending_invoices: number | null
          phone_number: string | null
          postal_code: string | null
          state: string | null
          status: string | null
          tags: string[] | null
          total_invoiced: number | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          bank_account_number?: string | null
          bank_details?: string | null
          city?: string | null
          company_name: string
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          fy_invoices?: number | null
          gst_number?: string | null
          id?: string
          last_invoice_date?: string | null
          owner_id: string
          pending_invoices?: number | null
          phone_number?: string | null
          postal_code?: string | null
          state?: string | null
          status?: string | null
          tags?: string[] | null
          total_invoiced?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          bank_account_number?: string | null
          bank_details?: string | null
          city?: string | null
          company_name?: string
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          fy_invoices?: number | null
          gst_number?: string | null
          id?: string
          last_invoice_date?: string | null
          owner_id?: string
          pending_invoices?: number | null
          phone_number?: string | null
          postal_code?: string | null
          state?: string | null
          status?: string | null
          tags?: string[] | null
          total_invoiced?: number | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          amount: number
          cgst_rate: number
          created_at: string
          description: string
          gst_rate: number
          hsn_code: string
          id: string
          invoice_id: string
          quantity: number
          rate: number
          sgst_rate: number
          sort_order: number
        }
        Insert: {
          amount?: number
          cgst_rate?: number
          created_at?: string
          description: string
          gst_rate?: number
          hsn_code: string
          id?: string
          invoice_id: string
          quantity?: number
          rate?: number
          sgst_rate?: number
          sort_order?: number
        }
        Update: {
          amount?: number
          cgst_rate?: number
          created_at?: string
          description?: string
          gst_rate?: number
          hsn_code?: string
          id?: string
          invoice_id?: string
          quantity?: number
          rate?: number
          sgst_rate?: number
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_templates: {
        Row: {
          client_id: string | null
          created_at: string
          id: string
          is_active: boolean
          is_default: boolean
          layout_data: Json
          margins: Json
          orientation: string
          owner_id: string
          paper_size: string
          template_name: string
          template_type: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          is_default?: boolean
          layout_data?: Json
          margins?: Json
          orientation?: string
          owner_id: string
          paper_size?: string
          template_name: string
          template_type?: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          is_default?: boolean
          layout_data?: Json
          margins?: Json
          orientation?: string
          owner_id?: string
          paper_size?: string
          template_name?: string
          template_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_invoice_templates_client_id"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          challan_date: string | null
          challan_number: string | null
          client_id: string
          created_at: string
          date: string
          dc_date: string | null
          dc_number: string | null
          due_date: string | null
          ewb_number: string | null
          gst_amount: number
          gst_type: string
          id: string
          invoice_number: string
          last_status_update: string | null
          notes: string | null
          owner_id: string
          po_date: string | null
          po_number: string | null
          status: string
          subtotal: number
          total: number
          updated_at: string
        }
        Insert: {
          challan_date?: string | null
          challan_number?: string | null
          client_id: string
          created_at?: string
          date: string
          dc_date?: string | null
          dc_number?: string | null
          due_date?: string | null
          ewb_number?: string | null
          gst_amount?: number
          gst_type?: string
          id?: string
          invoice_number: string
          last_status_update?: string | null
          notes?: string | null
          owner_id: string
          po_date?: string | null
          po_number?: string | null
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Update: {
          challan_date?: string | null
          challan_number?: string | null
          client_id?: string
          created_at?: string
          date?: string
          dc_date?: string | null
          dc_number?: string | null
          due_date?: string | null
          ewb_number?: string | null
          gst_amount?: number
          gst_type?: string
          id?: string
          invoice_number?: string
          last_status_update?: string | null
          notes?: string | null
          owner_id?: string
          po_date?: string | null
          po_number?: string | null
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
