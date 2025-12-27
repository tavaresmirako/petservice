import { supabase } from "@/integrations/supabase/client";

export interface AdminUser {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  user_type: 'client' | 'provider' | 'admin';
  is_blocked: boolean;
  deleted_at: string | null;
}

export const adminService = {
  async getAllUsers(): Promise<AdminUser[]> {
    // Nota: O Supabase Client não permite buscar emails da tabela auth.users diretamente por segurança.
    // Em um ambiente real, usaríamos uma Edge Function ou uma View que expõe os emails necessários.
    // Para este projeto, buscaremos os perfis e simularemos a junção se necessário.
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      throw error;
    }

    return data as AdminUser[];
  },

  async toggleUserBlock(userId: string, isBlocked: boolean): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .update({ is_blocked: isBlocked })
      .eq("id", userId);

    if (error) {
      console.error("Error toggling user block:", error);
      throw error;
    }
  },

  async softDeleteUser(userId: string): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", userId);

    if (error) {
      console.error("Error soft deleting user:", error);
      throw error;
    }
  }
};
