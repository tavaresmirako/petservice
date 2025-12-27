import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useRealtimeChat = (requestId: string | null) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!requestId || !user) return;

    setLoading(true);

    // Buscar mensagens históricas
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("request_id", requestId)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(data);
      }
      setLoading(false);
    };

    fetchMessages();

    // Inscrever no canal Realtime para novas mensagens nesta solicitação
    const channel = supabase
      .channel(`chat-${requestId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `request_id=eq.${requestId}`,
        },
        (payload) => {
          setMessages((prev) => {
            // Evitar duplicatas se o remetente já adicionou localmente
            if (prev.find((m) => m.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [requestId, user]);

  const sendMessage = async (content: string, receiverId: string) => {
    if (!user || !requestId) return;

    const { data, error } = await supabase.from("messages").insert([
      {
        request_id: requestId,
        sender_id: user.id,
        receiver_id: receiverId,
        content,
      },
    ]).select().single();

    if (!error && data) {
      setMessages((prev) => [...prev, data]);
    }

    return { error };
  };

  return { messages, sendMessage, loading };
};
