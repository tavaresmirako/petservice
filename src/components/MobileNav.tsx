import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { name: "Cadastrar", href: "/register" },
  { name: "Entrar", href: "/login/client" },
  { name: "Sou Prestador de Serviço", href: "/login/provider" },
  { name: "Serviços", href: "/search" },
];

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 border border-white/50 hover:bg-white/20 text-white"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="top" 
        className="w-full bg-white text-black border-b border-border transition-all duration-300 h-auto py-8"
      >
        <SheetHeader>
          <SheetTitle className="text-black border-b pb-2 text-center text-xl font-bold">Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col items-center gap-6 mt-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-xl font-semibold text-black hover:text-primary transition-colors p-2 w-full text-center hover:bg-black/5 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
