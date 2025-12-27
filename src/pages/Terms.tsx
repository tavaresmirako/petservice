import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
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

      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto p-8 bg-card">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Link>

          <h1 className="text-3xl font-bold mb-6 text-foreground">Termos de Serviço</h1>
          
          <div className="space-y-6 text-foreground">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Aceite dos Termos</h2>
              <p className="text-muted-foreground">
                Ao se cadastrar e utilizar a plataforma PetServices, você concorda com todos os termos e condições
                estabelecidos neste documento. Se você não concordar com algum termo, não prossiga com o cadastro.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Cadastro e Pagamento</h2>
              <p className="text-muted-foreground mb-2">
                Para utilizar a plataforma, tanto clientes quanto prestadores de serviço devem:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Realizar cadastro completo com informações verdadeiras</li>
                <li>Efetuar pagamento único de R$ 15,00 para acessar todas as funcionalidades</li>
                <li>Aceitar expressamente estes termos de serviço</li>
                <li>Ser maior de 18 anos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Responsabilidades dos Clientes</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Fornecer informações precisas sobre seus pets</li>
                <li>Manter contato respeitoso com prestadores de serviço</li>
                <li>Avaliar honestamente os serviços recebidos</li>
                <li>Não utilizar a plataforma para fins ilegais ou fraudulentos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Responsabilidades dos Prestadores</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Possuir CNPJ válido e documentação necessária</li>
                <li>Fornecer serviços de qualidade aos clientes</li>
                <li>Manter informações de perfil atualizadas e verdadeiras</li>
                <li>Cumprir com todas as regulamentações locais</li>
                <li>Responder prontamente às solicitações de clientes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Política de Privacidade</h2>
              <p className="text-muted-foreground">
                Seus dados pessoais serão tratados de acordo com a Lei Geral de Proteção de Dados (LGPD).
                Não compartilharemos suas informações com terceiros sem seu consentimento expresso.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Avaliações e Comentários</h2>
              <p className="text-muted-foreground">
                Todas as avaliações devem ser honestas e baseadas em experiências reais. Avaliações falsas
                ou ofensivas podem resultar em suspensão ou banimento da plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Isenção de Responsabilidade</h2>
              <p className="text-muted-foreground">
                A PetServices é uma plataforma de intermediação. Não nos responsabilizamos por:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Qualidade dos serviços prestados</li>
                <li>Acidentes ou danos ocorridos durante a prestação de serviços</li>
                <li>Disputas entre clientes e prestadores</li>
                <li>Conteúdo postado por usuários</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Modificações dos Termos</h2>
              <p className="text-muted-foreground">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. Usuários serão notificados
                sobre mudanças significativas.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Cancelamento e Reembolso</h2>
              <p className="text-muted-foreground">
                O pagamento de R$ 15,00 é não reembolsável após o cadastro ser completado e aprovado.
                A plataforma pode suspender contas que violem estes termos sem direito a reembolso.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Contato</h2>
              <p className="text-muted-foreground">
                Para dúvidas ou questões relacionadas a estes termos, entre em contato através do suporte
                da plataforma.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Terms;
