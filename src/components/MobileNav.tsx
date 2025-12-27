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
        <Button variant="ghost" size="icon" className="h-10 w-10 border border-white/50 hover:bg-white/20">
          <Menu className="h-6 w-6 text-white" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-[250px] bg-white dark:bg-[#1a1a1a] text-foreground border-l border-border transition-colors duration-300"
      >
        <SheetHeader>
          <SheetTitle className="text-foreground border-b pb-2 text-left">Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-lg font-medium text-foreground hover:text-primary transition-colors p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
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
