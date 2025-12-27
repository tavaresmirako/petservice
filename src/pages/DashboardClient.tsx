import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Logo from "@/components/Logo";
import { Heart, MessageSquare, Search, LogOut, User, Dog } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const DashboardClient = () => {
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [pets, setPets] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login/client");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchPets();
    }
  }, [user]);

  const fetchPets = async () => {
    const { data, error } = await supabase
      .from("pets")
      .select("*")
      .eq("owner_id", user?.id);

    if (!error && data) {
      setPets(data);
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
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-all bg-card"
            onClick={() => navigate("/search")}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-client/10 flex items-center justify-center">
                <Search className="w-6 h-6 text-client" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Buscar Serviços</h3>
                <p className="text-sm text-muted-foreground">Encontre prestadores</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-all bg-card"
            onClick={() => navigate("/favorites")}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-client/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-client" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Favoritos</h3>
                <p className="text-sm text-muted-foreground">Seus prestadores favoritos</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 cursor-pointer hover:shadow-lg transition-all bg-card"
            onClick={() => navigate("/messages")}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-client/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-client" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Mensagens</h3>
                <p className="text-sm text-muted-foreground">Chat com prestadores</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 bg-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-foreground">Meu Perfil</h2>
              <Button
                onClick={() => navigate("/profile/edit")}
                variant="outline"
                size="sm"
              >
                <User className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </div>
            <div className="space-y-3 text-foreground">
              <p><strong>Nome:</strong> {profile?.full_name}</p>
              {profile?.phone && <p><strong>Telefone:</strong> {profile.phone}</p>}
              {profile?.city && profile?.state && (
                <p><strong>Localização:</strong> {profile.city}, {profile.state}</p>
              )}
            </div>
          </Card>

          <Card className="p-6 bg-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-foreground">Meus Pets</h2>
              <Button
                onClick={() => navigate("/pets/add")}
                variant="outline"
                size="sm"
                className="bg-client/10 text-client border-client/20"
              >
                <Dog className="w-4 h-4 mr-2" />
                Adicionar Pet
              </Button>
            </div>
            {pets.length === 0 ? (
              <p className="text-muted-foreground">Nenhum pet cadastrado ainda.</p>
            ) : (
              <div className="space-y-3">
                {pets.map((pet) => (
                  <div key={pet.id} className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                    <Dog className="w-8 h-8 text-client" />
                    <div>
                      <p className="font-semibold text-foreground">{pet.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {pet.breed} • {pet.weight}kg
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
  );
};

export default DashboardClient;
