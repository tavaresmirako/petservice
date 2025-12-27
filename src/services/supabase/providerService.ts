import { supabase } from "@/integrations/supabase/client";

export interface ProviderSearchResult {
  provider_id: string;
  name: string;
  rating: number;
  review_count: number;
  city: string;
  state: string;
  business_name: string;
}

export const providerService = {
  async searchProviders(city: string, category: string): Promise<ProviderSearchResult[]> {
    const { data, error } = await supabase.rpc('search_providers_by_location_and_category', {
      target_city: city,
      target_category: category
    });

    if (error) {
      console.error("Error searching providers:", error);
      throw error;
    }

    return data || [];
  },

  async getProviderById(id: string) {
    const { data, error } = await supabase
      .from("providers")
      .select(`
        *,
        profiles!providers_id_fkey(*),
        services(*)
      `)
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }
};
