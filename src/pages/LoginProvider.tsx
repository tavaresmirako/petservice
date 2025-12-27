import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { ArrowLeft } from "lucide-react";

const LoginProvider = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await signIn(email, password);
    
    if (!error) {
      navigate("/dashboard/provider");
    }
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
            <h2 className="text-3xl font-bold text-provider mb-2">Área do Prestador</h2>
            <p className="text-muted-foreground">
              Ofereça seus serviços e encontre clientes
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="bg-white/50 dark:bg-black/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-white/50 dark:bg-black/20"
              />
            </div>

            <div className="space-y-4">
              <Button 
                type="submit" 
                className="w-full btn-theme-adaptive"
                size="lg"
              >
                Entrar
              </Button>
              <div className="text-center">
                <Link 
                  to="/auth/recover" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Esqueci minha senha
                </Link>
              </div>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Não tem conta?{" "}
              <Link to="/register/provider" className="text-provider hover:underline font-semibold">
                Cadastre-se
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginProvider;
