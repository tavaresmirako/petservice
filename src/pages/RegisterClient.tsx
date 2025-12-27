import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const RegisterClient = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    city: "",
    state: "",
  });
  const [petData, setPetData] = useState({
    name: "",
    petType: "" as "cachorro" | "gato" | "",
    breed: "",
    weight: "",
    size: "" as "pequeno" | "medio" | "grande" | "",
  });
  const [petPhoto, setPetPhoto] = useState<File | null>(null);
  const [petPhotoPreview, setPetPhotoPreview] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPetPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPetPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPetPhoto(null);
    setPetPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      toast({
        title: "Aceite os termos",
        description: "Você precisa aceitar os termos de serviço para continuar.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Senhas não conferem",
        description: "As senhas digitadas não são iguais.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    if (!petData.name || !petData.petType || !petData.size) {
      toast({
        title: "Dados do pet incompletos",
        description: "Preencha nome, tipo e porte do animal.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    const { error, data } = await signUp(formData.email, formData.password, {
      user_type: "client",
      full_name: formData.fullName,
      phone: formData.phone,
      city: formData.city,
      state: formData.state,
      terms_accepted: true,
      terms_accepted_at: new Date().toISOString(),
    });

    if (error || !data.user) {
      setLoading(false);
      return;
    }

    // Upload pet photo if exists
    let photoUrl = null;
    if (petPhoto) {
      const fileExt = petPhoto.name.split('.').pop();
      const fileName = `${data.user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('pet-photos')
        .upload(fileName, petPhoto);

      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage
          .from('pet-photos')
          .getPublicUrl(fileName);
        photoUrl = urlData.publicUrl;
      }
    }

    // Create pet record
    const petTypeMap = { cachorro: 'dog', gato: 'cat' } as const;
    const { error: petError } = await supabase.from('pets').insert([{
      owner_id: data.user.id,
      name: petData.name,
      pet_type: petTypeMap[petData.petType as 'cachorro' | 'gato'],
      breed: petData.breed || null,
      weight: petData.weight ? parseFloat(petData.weight) : null,
      size: petData.size,
      photo_url: photoUrl,
    }]);

    setLoading(false);

    if (petError) {
      toast({
        title: "Erro ao cadastrar pet",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Cadastro realizado!",
      description: "Você será redirecionado para completar o pagamento.",
    });
    navigate("/dashboard/client");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <header 
        className="py-6 shadow-md"
        style={{ background: 'var(--gradient-header)' }}
      >
        <div className="container mx-auto px-4 flex justify-center">
          <Logo />
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <Card className="w-full max-w-2xl p-8 bg-card shadow-elevated">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Link>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-client mb-2">Cadastro de Cliente</h2>
            <p className="text-muted-foreground">
              Encontre os melhores profissionais para seu pet
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  maxLength={2}
                  placeholder="UF"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Senha *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Pet Section */}
            <div className="border-t pt-6 mt-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Dados do Pet</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="petName">Nome do Pet *</Label>
                  <Input
                    id="petName"
                    value={petData.name}
                    onChange={(e) => setPetData({ ...petData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Animal *</Label>
                  <Select
                    value={petData.petType}
                    onValueChange={(value: "cachorro" | "gato") => setPetData({ ...petData, petType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cachorro">Cachorro</SelectItem>
                      <SelectItem value="gato">Gato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div className="space-y-2">
                  <Label>Porte *</Label>
                  <Select
                    value={petData.size}
                    onValueChange={(value: "pequeno" | "medio" | "grande") => setPetData({ ...petData, size: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pequeno">Pequeno</SelectItem>
                      <SelectItem value="medio">Médio</SelectItem>
                      <SelectItem value="grande">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="breed">Raça</Label>
                  <Input
                    id="breed"
                    value={petData.breed}
                    onChange={(e) => setPetData({ ...petData, breed: e.target.value })}
                    placeholder="Ex: Labrador"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={petData.weight}
                    onChange={(e) => setPetData({ ...petData, weight: e.target.value })}
                    placeholder="Ex: 10.5"
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Label>Foto do Pet</Label>
                {petPhotoPreview ? (
                  <div className="relative w-32 h-32">
                    <img
                      src={petPhotoPreview}
                      alt="Preview do pet"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/80"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-muted-foreground/50 rounded-lg cursor-pointer hover:border-client transition-colors">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground mt-1">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-2 pt-4">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                Li e aceito os{" "}
                <Link to="/terms" className="text-client hover:underline font-semibold">
                  termos de serviço
                </Link>{" "}
                da plataforma PetServices
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-client hover:bg-client/90"
              size="lg"
              disabled={loading}
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Já tem conta?{" "}
              <Link to="/login/client" className="text-client hover:underline font-semibold">
                Fazer login
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterClient;
