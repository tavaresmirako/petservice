import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useRealtimeNotifications = () => {
  const { user, profile } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!user || profile?.user_type !== "provider") return;

    // Buscar notificações pendentes iniciais
    const fetchInitialRequests = async () => {
      const { data, error } = await supabase
        .from("service_requests")
        .select("*, profiles!service_requests_client_id_fkey(full_name)")
        .eq("provider_id", user.id)
        .eq("status", "pending");

      if (!error && data) {
        setNotifications(data);
      }
    };

    fetchInitialRequests();

    // Inscrever no canal Realtime para novas solicitações
    const channel = supabase
      .channel(`provider-notifications-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "service_requests",
          filter: `provider_id=eq.${user.id}`,
        },
        async (payload) => {
          // Buscar dados do cliente para a notificação
          const { data: clientData } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", payload.new.client_id)
            .single();

          const newNotification = { ...payload.new, profiles: clientData };
          setNotifications((prev) => [newNotification, ...prev]);

          toast({
            title: "Nova Solicitação de Serviço!",
            description: `${clientData?.full_name || "Um cliente"} enviou uma nova solicitação.`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, profile, toast]);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return { notifications, removeNotification };
};
