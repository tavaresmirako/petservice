import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Logo from "@/components/Logo";
import { ArrowLeft, MapPin, Phone, Star, Instagram, Facebook, Youtube, Briefcase, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ProviderProfile = () => {
  const { toast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [provider, setProvider] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviderData();
  }, [id]);

  const fetchProviderData = async () => {
    setLoading(true);
    try {
      // Buscar dados do prestador e seu perfil
      const { data: providerData, error: providerError } = await supabase
        .from("providers")
        .select(`
          *,
          profiles!providers_id_fkey(*)
        `)
        .eq("id", id)
        .single();

      if (providerError) throw providerError;
      setProvider(providerData);

      // Buscar serviços oferecidos
      const { data: servicesData, error: servicesError } = await supabase
        .from("services")
        .select("*")
        .eq("provider_id", id);

      if (servicesError) throw servicesError;
      setServices(servicesData || []);

      // Buscar avaliações recebidas
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("*, profiles!reviews_client_id_fkey(full_name, avatar_url)")
        .eq("provider_id", id);

      if (reviewsError) throw reviewsError;
      setReviews(reviewsData || []);

    } catch (error) {
      console.error("Erro ao buscar dados do prestador:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando perfil do profissional...</p>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p>Profissional não encontrado.</p>
        <Button onClick={() => navigate(-1)}>Voltar</Button>
      </div>
    );
  }

  const profile = provider.profiles;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <header 
        className="py-6 shadow-md"
        style={{ background: 'var(--gradient-header)' }}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Logo />
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Coluna da Esquerda: Dados do Prestador */}
          <div className="md:col-span-1 space-y-6">
            <Card className="p-6 text-center bg-card shadow-elevated">
              <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-provider/20">
                <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                <AvatarFallback className="bg-provider/10 text-provider text-3xl">
                  {profile.full_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold text-foreground mb-1">{provider.business_name || profile.full_name}</h2>
              <p className="text-muted-foreground mb-2">{profile.full_name}</p>
              
              {/* Classificação em Estrelas */}
              <div className="flex justify-center items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < Math.round(provider.rating || 0) ? "text-yellow-500 fill-yellow-500" : "text-muted"}`} 
                  />
                ))}
                <span className="ml-2 font-bold text-foreground">{provider.rating?.toFixed(1) || "Novo"}</span>
              </div>

              <div className="space-y-3 text-left border-t pt-4">
                <div className="flex items-center gap-3 text-foreground">
                  <MapPin className="w-5 h-5 text-provider" />
                  <span>{profile.city || "Cidade não informada"}, {profile.state || "UF"}</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <Phone className="w-5 h-5 text-provider" />
                  <span>{profile.phone || "Telefone não informado"}</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <Briefcase className="w-5 h-5 text-provider" />
                  <span className="capitalize">{provider.service_type || "Serviços Pet"}</span>
                </div>
              </div>

              {/* Redes Sociais */}
              <div className="flex justify-center gap-4 mt-6 pt-4 border-t">
                {provider.instagram && (
                  <a href={provider.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-pink-600 transition-colors">
                    <Instagram className="w-6 h-6" />
                  </a>
                )}
                {provider.facebook && (
                  <a href={provider.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue-600 transition-colors">
                    <Facebook className="w-6 h-6" />
                  </a>
                )}
                {provider.youtube && (
                  <a href={provider.youtube} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-red-600 transition-colors">
                    <Youtube className="w-6 h-6" />
                  </a>
                )}
              </div>

<div className="mt-6 space-y-2">
	                <Button 
	                  className="w-full bg-provider hover:bg-provider/90"
	                  onClick={async () => {
	                    if (!currentUser) {
	                      navigate("/login/client");
	                      return;
	                    }
	                    
	                    const { error } = await supabase.from("service_requests").insert([
	                      {
	                        client_id: currentUser.id,
	                        provider_id: id,
	                        status: 'pending',
	                        message: 'Olá, gostaria de solicitar um serviço.'
	                      }
	                    ]);

	                    if (error) {
	                      toast({
	                        title: "Erro",
	                        description: "Não foi possível enviar a solicitação.",
	                        variant: "destructive",
	                      });
	                    } else {
	                      toast({
	                        title: "Solicitação Enviada!",
	                        description: "O prestador será notificado em tempo real.",
	                      });
	                    }
	                  }}
	                >
	                  <MessageSquare className="w-4 h-4 mr-2" />
	                  Solicitar Serviço
	                </Button>
                {currentUser?.id === id && (
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/provider/profile/edit")}
                  >
                    Editar Perfil
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Coluna da Direita: Descrição, Serviços e Avaliações */}
          <div className="md:col-span-2 space-y-6">
            {/* Sobre o Profissional */}
            <Card className="p-6 bg-card shadow-elevated">
              <h3 className="text-xl font-bold text-foreground mb-4">Sobre o Profissional</h3>
              <p className="text-foreground leading-relaxed">
                {provider.description || "Este profissional ainda não adicionou uma descrição."}
              </p>
              {provider.experience && (
                <div className="mt-4 p-4 bg-secondary rounded-lg">
                  <h4 className="font-bold text-foreground mb-1">Experiência</h4>
                  <p className="text-sm text-muted-foreground">{provider.experience}</p>
                </div>
              )}
            </Card>

            {/* Serviços Oferecidos */}
            <Card className="p-6 bg-card shadow-elevated">
              <h3 className="text-xl font-bold text-foreground mb-4">Serviços Oferecidos</h3>
              {services.length === 0 ? (
                <p className="text-muted-foreground">Nenhum serviço específico listado.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <div key={service.id} className="p-4 border rounded-lg flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-foreground">{service.name || service.category}</h4>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                      <p className="font-bold text-provider">R$ {service.price}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Avaliações dos Clientes */}
            <Card className="p-6 bg-card shadow-elevated">
              <h3 className="text-xl font-bold text-foreground mb-4">Avaliações dos Clientes</h3>
              {reviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Ainda não há avaliações para este profissional.</p>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="flex gap-4 p-4 bg-secondary/30 rounded-xl">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={review.profiles?.avatar_url} />
                        <AvatarFallback>{review.profiles?.full_name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-bold text-foreground">{review.profiles?.full_name}</h4>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground italic">"{review.comment}"</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(review.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;
