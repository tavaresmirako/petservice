import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { name: "Cadastrar", href: "/register" },
  { name: "Entrar", href: "/login/client" },
  { name: "Sou Prestador", href: "/login/provider" },
  { name: "Serviços", href: "/search" },
];

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-10 w-auto px-3 border border-white/50 hover:bg-white/20 text-white flex items-center gap-2"
        >
          <span className="text-sm font-bold tracking-wider">MENU</span>
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-[160px] h-fit max-h-[400px] my-auto top-0 bottom-0 border border-border rounded-l-2xl shadow-2xl transition-all duration-300 p-4 overflow-hidden"
        style={{ 
          backgroundColor: 'var(--bg-start)',
          color: 'var(--text-color)'
        }}
      >
        <SheetHeader>
          <SheetTitle 
            className="border-b pb-2 text-left text-sm font-bold"
            style={{ color: 'var(--text-color)' }}
          >
            Menu
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-2 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-xs font-bold transition-all duration-200 p-2 rounded-lg hover:bg-primary/10 hover:text-primary hover:pl-3"
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
