import { useState } from "react";
import { Bell, Check, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ChatModal from "./ChatModal";

const NotificationBell = () => {
  const { notifications, removeNotification } = useRealtimeNotifications();
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const handleAction = async (requestId: string, status: 'accepted' | 'rejected') => {
    const { error } = await supabase
      .from("service_requests")
      .update({ status })
      .eq("id", requestId);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a solicitação.",
        variant: "destructive",
      });
    } else {
      toast({
        title: status === 'accepted' ? "Solicitação Aceita!" : "Solicitação Rejeitada",
        description: status === 'accepted' ? "O chat agora está disponível." : "A solicitação foi removida.",
      });
      
      if (status === 'accepted') {
        const request = notifications.find(n => n.id === requestId);
        setSelectedRequest(request);
      }
      
      removeNotification(requestId);
    }
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="p-4 border-b">
            <h3 className="font-bold">Solicitações Pendentes</h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                Nenhuma nova solicitação.
              </div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="p-4 border-b hover:bg-accent/50 transition-colors">
                  <p className="text-sm font-medium">{n.profiles?.full_name || "Cliente"}</p>
                  <p className="text-xs text-muted-foreground mb-3">Solicitou um serviço</p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleAction(n.id, 'accepted')}
                    >
                      <Check className="h-4 w-4 mr-1" /> Aceitar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                      onClick={() => handleAction(n.id, 'rejected')}
                    >
                      <X className="h-4 w-4 mr-1" /> Recusar
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>

      {selectedRequest && (
        <ChatModal 
          requestId={selectedRequest.id} 
          receiverId={selectedRequest.client_id}
          receiverName={selectedRequest.profiles?.full_name || "Cliente"}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </>
  );
};

export default NotificationBell;
