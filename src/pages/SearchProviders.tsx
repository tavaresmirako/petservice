import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Logo from "@/components/Logo";
import { Search, Star, MapPin, LogOut, Heart, MessageSquare } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSearchProviders } from "@/hooks/useSearchProviders";

const categoryNames: Record<string, string> = {
  passeio: "Passeio Pet",
  banho_tosa: "Banho e Tosa",
  veterinario: "Veterinário",
  hospedagem: "Hospedagem",
  taxi_pet: "Táxi Pet",
  adestramento: "Adestramento",
};

const SearchProviders = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");

  const { data: providers = [], isLoading, isError } = useSearchProviders(selectedCity, selectedCategory);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam && categoryNames[categoryParam]) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const filteredProviders = providers.filter((provider: any) => {
    const nameToSearch = (provider.business_name || provider.name || "").toLowerCase();
    return nameToSearch.includes(searchTerm.toLowerCase());
  });

  const cities = [...new Set(providers.map((p: any) => p.city).filter(Boolean))];

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
                placeholder="Buscar por nome..."
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
                {cities.map((city: any) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : isError ? (
          <div className="text-center text-red-500 py-12">
            Erro ao carregar profissionais. Por favor, tente novamente.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider: any) => (
              <Card key={provider.provider_id} className="overflow-hidden hover:shadow-lg transition-all bg-white/60 dark:bg-black/40 backdrop-blur-md">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {provider.business_name || provider.name}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {provider.city}, {provider.state}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-foreground">
                        {provider.rating?.toFixed(1) || "Novo"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Button
                      className="flex-1 btn-theme-adaptive"
                      onClick={() => navigate(`/profile/provider/${provider.provider_id}`)}
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
        )}
      </div>
    </div>
  );
};

export default SearchProviders;
