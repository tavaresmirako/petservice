import { useQuery } from "@tanstack/react-query";
import { providerService } from "@/services/supabase/providerService";

export const useSearchProviders = (city: string, category: string) => {
  return useQuery({
    queryKey: ["providers", city, category],
    queryFn: () => providerService.searchProviders(city, category),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
