import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Logo from "@/components/Logo";
import { Star, MessageSquare, Briefcase, LogOut, User, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const DashboardProvider = () => {
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [providerData, setProviderData] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login/provider");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProviderData();
      fetchServices();
      fetchRequests();
    }
  }, [user]);

  const fetchProviderData = async () => {
    const { data, error } = await supabase
      .from("providers")
      .select("*")
      .eq("id", user?.id)
      .maybeSingle();

    if (!error && data) {
      setProviderData(data);
    }
  };

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("provider_id", user?.id);

    if (!error && data) {
      setServices(data);
    }
  };

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("service_requests")
      .select("*, profiles!service_requests_client_id_fkey(full_name)")
      .eq("provider_id", user?.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (!error && data) {
      setRequests(data);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <header 
        className="py-6 shadow-md"
        style={{ background: 'var(--gradient-header)' }}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-4">
            <span className="text-white">Olá, {profile?.full_name}</span>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-provider/10 flex items-center justify-center">
                <Star className="w-6 h-6 text-provider" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {providerData?.rating?.toFixed(1) || "0.0"}
                </p>
                <p className="text-sm text-muted-foreground">Avaliação</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-provider/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-provider" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{providerData?.review_count || 0}</p>
                <p className="text-sm text-muted-foreground">Avaliações</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-provider/10 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-provider" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{services.length}</p>
                <p className="text-sm text-muted-foreground">Serviços</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-all bg-card"
            onClick={() => navigate("/messages")}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-provider/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-provider" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-sm text-muted-foreground">Mensagens</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 bg-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-foreground">Perfil Profissional</h2>
              <Button
                onClick={() => navigate("/provider/profile/edit")}
                variant="outline"
                size="sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </div>
            <div className="space-y-3 text-foreground">
              <p><strong>Nome:</strong> {profile?.full_name}</p>
              {providerData?.business_name && (
                <p><strong>Empresa:</strong> {providerData.business_name}</p>
              )}
              <p><strong>CNPJ:</strong> {providerData?.cnpj}</p>
              {profile?.city && profile?.state && (
                <p><strong>Localização:</strong> {profile.city}, {profile.state}</p>
              )}
            </div>
            <div className="mt-4">
              <Button
                onClick={() => navigate("/services/add")}
                className="w-full bg-provider hover:bg-provider/90"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Adicionar Serviço
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-card">
            <h2 className="text-xl font-bold mb-4 text-foreground">Solicitações Recentes</h2>
            {requests.length === 0 ? (
              <p className="text-muted-foreground">Nenhuma solicitação ainda.</p>
            ) : (
              <div className="space-y-3">
                {requests.map((request: any) => (
                  <div key={request.id} className="p-3 bg-secondary rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-foreground">
                          {request.profiles?.full_name}
                        </p>
                        <p className="text-sm text-muted-foreground">{request.message}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardProvider;
