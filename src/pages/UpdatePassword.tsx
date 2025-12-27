import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";
import { Lock } from "lucide-react";

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { updatePassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter no mínimo 8 caracteres.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Senhas não conferem",
        description: "A nova senha e a confirmação devem ser iguais.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await updatePassword(password);

    if (error) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar sua senha.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Senha Atualizada!",
        description: "Sua senha foi alterada com sucesso. Faça login novamente.",
      });
      navigate("/login/client");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-transparent relative">
      <header 
        className="py-6 shadow-md relative z-10"
        style={{ background: 'var(--gradient-header)' }}
      >
        <div className="container mx-auto px-4 flex justify-center">
          <Logo />
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[calc(100vh-200px)] relative z-10">
        <Card className="w-full max-w-md p-8 bg-white/60 dark:bg-black/40 backdrop-blur-md shadow-elevated">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-2">Nova Senha</h2>
            <p className="text-muted-foreground">
              Crie uma nova senha segura para sua conta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-10 bg-white/50 dark:bg-black/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-10 bg-white/50 dark:bg-black/20"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full btn-theme-adaptive"
              size="lg"
              disabled={loading}
            >
              {loading ? "Atualizando..." : "Redefinir Senha"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default UpdatePassword;
