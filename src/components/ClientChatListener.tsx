import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ChatModal from "./ChatModal";

const ClientChatListener = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [activeChat, setActiveChat] = useState<any>(null);

  useEffect(() => {
    if (!user || profile?.user_type !== "client") return;

    // Inscrever no canal Realtime para atualizações de status nas solicitações do cliente
    const channel = supabase
      .channel(`client-notifications-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "service_requests",
          filter: `client_id=eq.${user.id}`,
        },
        async (payload) => {
          if (payload.new.status === 'accepted' && payload.old.status === 'pending') {
            // Buscar dados do prestador
            const { data: providerData } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("id", payload.new.provider_id)
              .single();

            toast({
              title: "Solicitação Aceita!",
              description: `${providerData?.full_name || "O prestador"} aceitou sua solicitação. O chat está aberto.`,
            });

            setActiveChat({
              id: payload.new.id,
              provider_id: payload.new.provider_id,
              provider_name: providerData?.full_name || "Prestador"
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, profile, toast]);

  if (!activeChat) return null;

  return (
    <ChatModal 
      requestId={activeChat.id} 
      receiverId={activeChat.provider_id}
      receiverName={activeChat.provider_name}
      onClose={() => setActiveChat(null)}
    />
  );
};

export default ClientChatListener;
