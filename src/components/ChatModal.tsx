import { useState, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { useAuth } from "@/contexts/AuthContext";

interface ChatModalProps {
  requestId: string;
  receiverId: string;
  receiverName: string;
  onClose: () => void;
}

const ChatModal = ({ requestId, receiverId, receiverName, onClose }: ChatModalProps) => {
  const { user } = useAuth();
  const { messages, sendMessage, loading } = useRealtimeChat(requestId);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const content = newMessage;
    setNewMessage("");
    await sendMessage(content, receiverId);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl flex flex-col h-[600px] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-primary text-primary-foreground">
          <div>
            <h3 className="font-bold">{receiverName}</h3>
            <p className="text-xs opacity-80">Chat em tempo real</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/20">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-zinc-950"
        >
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              Inicie a conversa!
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.sender_id === user?.id 
                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                      : 'bg-white dark:bg-zinc-800 border rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 border-t bg-white dark:bg-zinc-900 flex gap-2">
          <Input 
            placeholder="Digite sua mensagem..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;
