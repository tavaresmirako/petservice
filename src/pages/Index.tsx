import { Button } from "@/components/ui/button";
import MobileNav from "@/components/MobileNav";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import heroImage1 from "@/assets/hero-pets-1.jpg";
import heroImage2 from "@/assets/hero-pets-2.jpg";
import Carousel from "@/components/Carousel";
import { 
  User, 
  Briefcase, 
  Dog, 
  Bath, 
  Home, 
  GraduationCap, 
  Stethoscope, 
  Car
} from "lucide-react";

const Index = () => {
  const services = [
    { icon: Dog, title: "Passeio Pet", description: "Passeios seguros e divertidos" },
    { icon: Bath, title: "Banho e Tosa", description: "Cuidados especializados" },
    { icon: Stethoscope, title: "Veterinário", description: "Cuidados médicos para seu pet" },
    { icon: Car, title: "Táxi Pet", description: "Transporte seguro" },
    { icon: null, title: "", description: "", hidden: true },
    { icon: GraduationCap, title: "Adestramento", description: "Treinamento profissional" },
    { icon: Home, title: "Hospedagem", description: "Aconchego e segurança" },
  ];

  return (
    <div className="min-h-screen bg-transparent relative">
      {/* Header Reativo ao Tema */}
      <header 
        className="py-6 shadow-md relative z-10 transition-colors duration-300"
        style={{ 
          backgroundColor: 'var(--header-bg)',
          color: 'var(--header-text)'
        }}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Logo />
          <p className="text-neon text-center text-base sm:text-xl font-semibold mx-4 hidden md:block whitespace-nowrap">
            Cuidado completo, carinho e serviços especializados para seus animais.
          </p>
          <div className="flex items-center gap-4">
            <MobileNav />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 relative z-10">
        <div className="mb-12 rounded-2xl overflow-hidden shadow-elevated">
          <Carousel 
            images={[heroImage1, heroImage2]}
            interval={5000}
            className="w-full aspect-[1259/415]"
          />
        </div>
        
        {/* User Type Selection */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <Card className="p-8 text-center hover:shadow-elevated transition-all duration-300 border-2 hover:border-client bg-white/60 dark:bg-black/40 backdrop-blur-md">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-client/10 flex items-center justify-center">
                <User className="w-10 h-10 text-client" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Sou dono de pet</h3>
            <p className="text-client mb-6">Encontre serviços para seu pet</p>
            <Link to="/login/client">
              <Button className="w-full btn-theme-adaptive" size="lg">
                ENTRAR
              </Button>
            </Link>
          </Card>

          <Card className="p-8 text-center hover:shadow-elevated transition-all duration-300 border-2 hover:border-provider bg-white/60 dark:bg-black/40 backdrop-blur-md">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-provider/10 flex items-center justify-center">
                <Briefcase className="w-10 h-10 text-provider" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Sou Prestador de Serviço</h3>
            <p className="text-provider mb-6">Ofereça seus serviços</p>
            <Link to="/login/provider">
              <Button className="w-full btn-theme-adaptive" size="lg">
                ENTRAR
              </Button>
            </Link>
          </Card>
        </div>

        {/* Services Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Serviços Disponíveis
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {services.map((service, index) => {
              if (service.hidden) {
                return <div key={index} className="hidden lg:block"></div>;
              }
              const Icon = service.icon;
              return (
                <Card 
                  key={index} 
                  className="p-6 text-center card-neon-hover cursor-pointer group bg-white/60 dark:bg-black/40 backdrop-blur-md border-2 border-transparent"
                >
                  <div className="flex justify-center mb-3">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      {Icon && <Icon className="w-8 h-8 text-accent" />}
                    </div>
                  </div>
                  <h4 className="font-semibold mb-1">{service.title}</h4>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/60 dark:bg-black/40 backdrop-blur-md py-8 mt-20 border-t relative z-10">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 PetServices - Conectando donos de pets a prestadores qualificados</p>
          <p className="mt-2">
            Desenvolvido por{" "}
            <a 
              href="https://www.linkedin.com/in/thiago-tavares-6328936a/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold transition-all"
            >
              Thiago Tavares
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
