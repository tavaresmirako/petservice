import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Logo from "@/components/Logo";
import { Search, Star, MapPin, LogOut, Heart, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const categoryNames: Record<string, string> = {
  passeio: "Passeio Pet",
  banho_tosa: "Banho e Tosa",
  veterinario: "Veterinário",
  hospedagem: "Hospedagem",
  taxi_pet: "Táxi Pet",
  adestramento: "Adestramento",
};

const SearchProviders = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [providers, setProviders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam && categoryNames[categoryParam]) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProviders();
  }, [selectedCategory, selectedCity]);

  const fetchProviders = async () => {
    // Se houver uma categoria selecionada, usamos a RPC otimizada
    if (selectedCategory !== "all") {
      const { data, error } = await supabase.rpc('search_providers_optimized', {
        p_category: selectedCategory,
        p_city: selectedCity === "all" ? null : selectedCity
      });

      if (!error && data) {
        // Mapear os dados da RPC para o formato esperado pelo componente
        const mappedData = data.map((item: any) => ({
          id: item.provider_id,
          business_name: item.name,
          rating: item.rating,
          review_count: item.review_count,
          profiles: {
            full_name: item.name,
            city: item.city,
            state: "" // A RPC não retorna o estado, mas podemos ajustar se necessário
          },
          services: [{ category: selectedCategory }]
        }));
        setProviders(mappedData);
        return;
      }
    }

    // Fallback para busca geral se nenhuma categoria estiver selecionada ou se a RPC falhar
    const { data, error } = await supabase
      .from("providers")
      .select(`
        *,
        profiles!providers_id_fkey(full_name, city, state, phone),
        services(category)
      `);

    if (!error && data) {
      setProviders(data);
    }
  };

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch = 
      provider.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = 
      selectedCategory === "all" ||
      provider.services?.some((s: any) => s.category === selectedCategory);

    const matchesCity =
      selectedCity === "all" ||
      provider.profiles?.city === selectedCity;

    return matchesSearch && matchesCategory && matchesCity;
  });

  const cities = [...new Set(providers.map((p) => p.profiles?.city).filter(Boolean))];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-transparent relative">
      <header 
        className="py-6 shadow-md relative z-10"
        style={{ background: 'var(--gradient-header)' }}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-4">

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

      <div className="container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-foreground">
          Encontre o Profissional Ideal
        </h1>

        <Card className="p-6 mb-8 bg-white/60 dark:bg-black/40 backdrop-blur-md">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 dark:bg-black/20"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-white/50 dark:bg-black/20">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent position="popper" className="z-[100]">
                <SelectItem value="all">Todas as categorias</SelectItem>
                {Object.entries(categoryNames).map(([key, name]) => (
                  <SelectItem key={key} value={key}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="bg-white/50 dark:bg-black/20">
                <SelectValue placeholder="Cidade" />
              </SelectTrigger>
              <SelectContent position="popper" className="z-[100]">
                <SelectItem value="all">Todas as cidades</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <Card key={provider.id} className="overflow-hidden hover:shadow-lg transition-all bg-white/60 dark:bg-black/40 backdrop-blur-md">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {provider.business_name || provider.profiles?.full_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{provider.profiles?.full_name}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-foreground">
                      {provider.rating?.toFixed(1) || "Novo"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-foreground">
                  <p className="text-sm line-clamp-2">{provider.description || "Sem descrição"}</p>
                  
                  {provider.profiles?.city && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{provider.profiles.city}, {provider.profiles.state}</span>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Documento: {provider.cnpj}
                  </p>

                  {provider.review_count > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {provider.review_count} {provider.review_count === 1 ? "avaliação" : "avaliações"}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 btn-theme-adaptive"
                    onClick={() => navigate(`/profile/provider/${provider.id}`)}
                  >
                    Ver Perfil
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-client text-client hover:bg-client/10"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-client text-client hover:bg-client/10"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchProviders;
