import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";
import { ArrowLeft, Mail } from "lucide-react";

const PasswordRecovery = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { sendPasswordRecoveryEmail } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await sendPasswordRecoveryEmail(email);

    if (error) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível enviar o email de recuperação.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Email Enviado!",
        description: "Se o email estiver cadastrado, você receberá um link para redefinir sua senha.",
      });
      setEmail("");
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
          <Link 
            to="/" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Link>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-2">Recuperar Senha</h2>
            <p className="text-muted-foreground">
              Informe seu email para receber o link de redefinição
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
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
              {loading ? "Enviando..." : "Enviar Link de Recuperação"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Lembrou sua senha?{" "}
              <Link to="/login/client" className="text-primary hover:underline font-semibold">
                Voltar para o Login
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PasswordRecovery;
