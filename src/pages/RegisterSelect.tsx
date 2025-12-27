import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { User, Briefcase, ArrowLeft } from "lucide-react";

const RegisterSelect = () => {
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
        <Card className="w-full max-w-xl p-8 bg-card shadow-elevated">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Link>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-2">Como você deseja se cadastrar?</h2>
            <p className="text-muted-foreground">
              Escolha a opção que melhor se encaixa no seu perfil.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Opção Cliente */}
            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary">
              <User className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Sou Cliente</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Quero encontrar e contratar serviços para meu pet.
              </p>
              <Button asChild className="w-full">
                <Link to="/register/client">
                  Cadastrar como Cliente
                </Link>
              </Button>
            </Card>

            {/* Opção Prestador de Serviço */}
            <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 border-transparent hover:border-provider">
              <Briefcase className="w-12 h-12 text-provider mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Sou Prestador de Serviço</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Quero oferecer meus serviços e encontrar novos clientes.
              </p>
              <Button asChild className="w-full bg-provider hover:bg-provider/90">
                <Link to="/register/provider">
                  Cadastrar como Prestador de Serviço
                </Link>
              </Button>
            </Card>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterSelect;
