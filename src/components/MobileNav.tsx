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
        side="right" 
        className="w-[250px] border-l border-border transition-colors duration-300"
        style={{ 
          backgroundColor: 'var(--bg-start)',
          color: 'var(--text-color)'
        }}
      >
        <SheetHeader>
          <SheetTitle 
            className="border-b pb-2 text-left"
            style={{ color: 'var(--text-color)' }}
          >
            Menu
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-lg font-medium transition-colors p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
              style={{ color: 'var(--text-color)' }}
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
