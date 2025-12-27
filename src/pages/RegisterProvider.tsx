import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { ArrowLeft } from "lucide-react";
import { serviceIconMap, serviceTypes } from "@/lib/service-icons";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const RegisterProvider = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    cnpj: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    city: "",
    state: "",
    description: "",
    serviceType: "",
    profilePhoto: null as File | null,
    socialMediaLink: "",
    experience: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    let avatarUrl = null;

    // 1. Upload da foto de perfil, se existir
    if (formData.profilePhoto) {
      const file = formData.profilePhoto;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        toast({
          title: "Erro no upload da foto",
          description: uploadError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      avatarUrl = publicUrlData.publicUrl;
    }

    // 2. Cadastro do usuário no Auth
    const { error: authError, data: authData } = await signUp(formData.email, formData.password, {
      user_type: "provider",
      full_name: formData.fullName,
      phone: formData.phone,
      city: formData.city,
      state: formData.state,
      terms_accepted: true,
      terms_accepted_at: new Date().toISOString(),
      avatar_url: avatarUrl, // Adiciona o URL do avatar ao perfil
    });

    if (authError) {
      setLoading(false);
      return; // O erro já é tratado dentro do signUp
    }

    // 3. Criação do perfil de prestador
    if (authData.user) {
      const { error: providerError } = await supabase.from("providers").insert([{
        id: authData.user.id,
      business_name: formData.businessName,
          service_type: formData.serviceType,        cnpj: formData.cnpj,
        description: formData.description,
       experience: formData.experience,
          social_media_link: formData.socialMediaLink,     }]);

      if (providerError) {
        toast({
          title: "Erro ao criar perfil de prestador",
          description: providerError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
    }

    toast({
      title: "Cadastro realizado!",
      description: "Você será redirecionado para completar o pagamento.",
    });
    navigate("/dashboard/provider");

    setLoading(false);
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
        <Card className="w-full max-w-3xl p-8 bg-card shadow-elevated">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Link>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-provider mb-2">Cadastro de Prestador</h2>
            <p className="text-muted-foreground">
              Ofereça seus serviços e encontre novos clientes
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
                <Label htmlFor="businessName">Nome da Empresa</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                  placeholder="00.000.000/0000-00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                  required
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
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  maxLength={2}
                  placeholder="UF"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição Profissional</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Conte um pouco sobre seus serviços..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experiência</Label>
              <Textarea
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                rows={2}
                placeholder="Ex: 5 anos de experiência..."
              />
            </div>

            {/* Novo campo: Tipo de Serviço */}
            <div className="space-y-2">
              <Label htmlFor="serviceType">Tipo de Serviço *</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, serviceType: value })} required>
                <SelectTrigger id="serviceType">
                  <SelectValue placeholder="Selecione o tipo de serviço" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((type) => {
                    const { icon: Icon, label } = serviceIconMap[type];
                    return (
                      <SelectItem key={type} value={type}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Novo campo: Foto de Perfil */}
            <div className="space-y-2">
              <Label htmlFor="profilePhoto">Foto de Perfil</Label>
              <Input
                id="profilePhoto"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, profilePhoto: e.target.files ? e.target.files[0] : null })}
              />
            </div>

            {/* Novo campo: Link de Rede Social */}
            <div className="space-y-2">
              <Label htmlFor="socialMediaLink">Link de Rede Social</Label>
              <Input
                id="socialMediaLink"
                value={formData.socialMediaLink}
                onChange={(e) => setFormData({ ...formData, socialMediaLink: e.target.value })}
                placeholder="Ex: https://instagram.com/seuperfil"
              />
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

            <div className="flex items-start space-x-2 pt-4">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                Li e aceito os{" "}
                <Link to="/terms" className="text-provider hover:underline font-semibold">
                  termos de serviço
                </Link>{" "}
                da plataforma PetServices
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-provider hover:bg-provider/90"
              size="lg"
              disabled={loading}
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Já tem conta?{" "}
              <Link to="/login/provider" className="text-provider hover:underline font-semibold">
                Fazer login
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterProvider;
