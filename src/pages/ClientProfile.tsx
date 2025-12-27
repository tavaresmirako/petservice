import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Logo from "@/components/Logo";
import { ArrowLeft, MapPin, Phone, User, Dog, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ClientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [clientProfile, setClientProfile] = useState<any>(null);
  const [pets, setPets] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientData();
  }, [id]);

  const fetchClientData = async () => {
    setLoading(true);
    try {
      // Buscar perfil do cliente
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (profileError) throw profileError;
      setClientProfile(profileData);

      // Buscar pets do cliente
      const { data: petsData, error: petsError } = await supabase
        .from("pets")
        .select("*")
        .eq("owner_id", id);

      if (petsError) throw petsError;
      setPets(petsData || []);

      // Buscar avaliações feitas pelo cliente (ou sobre o cliente, se houver)
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("*, profiles!reviews_provider_id_fkey(full_name)")
        .eq("client_id", id);

      if (reviewsError) throw reviewsError;
      setReviews(reviewsData || []);

    } catch (error) {
      console.error("Erro ao buscar dados do cliente:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando perfil...</p>
      </div>
    );
  }

  if (!clientProfile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p>Perfil não encontrado.</p>
        <Button onClick={() => navigate(-1)}>Voltar</Button>
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
          {/* Coluna da Esquerda: Dados do Cliente */}
          <div className="md:col-span-1 space-y-6">
            <Card className="p-6 text-center bg-card shadow-elevated">
              <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-client/20">
                <AvatarImage src={clientProfile.avatar_url} alt={clientProfile.full_name} />
                <AvatarFallback className="bg-client/10 text-client text-3xl">
                  {clientProfile.full_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold text-foreground mb-1">{clientProfile.full_name}</h2>
              <p className="text-muted-foreground mb-4 capitalize">{clientProfile.user_type === 'client' ? 'Dono de Pet' : 'Prestador'}</p>
              
              <div className="space-y-3 text-left border-t pt-4">
                <div className="flex items-center gap-3 text-foreground">
                  <MapPin className="w-5 h-5 text-client" />
                  <span>{clientProfile.city || "Cidade não informada"}, {clientProfile.state || "UF"}</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <Phone className="w-5 h-5 text-client" />
                  <span>{clientProfile.phone || "Telefone não informado"}</span>
                </div>
              </div>

              {currentUser?.id === id && (
                <Button 
                  className="w-full mt-6 bg-client hover:bg-client/90"
                  onClick={() => navigate("/profile/edit")}
                >
                  Editar Perfil
                </Button>
              )}
            </Card>
          </div>

          {/* Coluna da Direita: Pets e Avaliações */}
          <div className="md:col-span-2 space-y-6">
            {/* Dados do Animal Completo */}
            <Card className="p-6 bg-card shadow-elevated">
              <div className="flex items-center gap-2 mb-6">
                <Dog className="w-6 h-6 text-client" />
                <h3 className="text-xl font-bold text-foreground">Meus Animais</h3>
              </div>

              {pets.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Nenhum animal cadastrado.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {pets.map((pet) => (
                    <div key={pet.id} className="p-4 bg-secondary rounded-xl border border-border/50 flex gap-4">
                      <div className="w-16 h-16 rounded-full bg-client/10 flex items-center justify-center flex-shrink-0">
                        {pet.photo_url ? (
                          <img src={pet.photo_url} alt={pet.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <Dog className="w-8 h-8 text-client" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">{pet.name}</h4>
                        <p className="text-sm text-muted-foreground">{pet.breed || "Raça não informada"}</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          <span className="text-xs bg-client/10 text-client px-2 py-0.5 rounded-full">{pet.pet_type}</span>
                          {pet.weight && <span className="text-xs bg-secondary-foreground/10 text-muted-foreground px-2 py-0.5 rounded-full">{pet.weight}kg</span>}
                        </div>
                        {pet.notes && <p className="text-xs text-muted-foreground mt-2 italic">"{pet.notes}"</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Campo de Avaliação */}
            <Card className="p-6 bg-card shadow-elevated">
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-6 h-6 text-yellow-500" />
                <h3 className="text-xl font-bold text-foreground">Avaliações e Histórico</h3>
              </div>

              {reviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Ainda não há avaliações registradas.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 border-b last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-foreground">Serviço com: {review.profiles?.full_name}</p>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground italic">"{review.comment}"</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(review.created_at).toLocaleDateString('pt-BR')}
                      </p>
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

export default ClientProfile;
