import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AuthSidebar from "@/components/AuthSidebar";
import { Leaf, Menu, Home, ShoppingBag, Users, Calendar, User, MessageCircle } from "lucide-react";

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "Beranda", icon: Home },
    { path: "/my-plants", label: "Tanaman Saya", icon: Leaf },
    { path: "/konsultasi", label: "Chat AI", icon: MessageCircle },
    { path: "/reminders", label: "Pengingat", icon: Calendar },
    { path: "/products", label: "Rekomendasi", icon: ShoppingBag },
    { path: "/community", label: "Komunitas", icon: Users },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b-4 border-primary/20 bg-gradient-card backdrop-blur-md sticky top-0 z-50 shadow-fun">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Game Style */}
          <Link to="/" className="flex items-center space-x-3 hover-bounce">
            <div className="p-2.5 bg-gradient-fun rounded-2xl shadow-fun">
              <img src="/lovable-uploads/16156f1e-2e79-486b-bb1a-132d152f1756.png" alt="Manggrow Logo" className="h-7 w-7" />
            </div>
            <span className="text-xl font-game font-bold text-foreground">Manggrow 🌱</span>
          </Link>

          {/* Desktop Menu - Game Style */}
          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const emojis = ["🏠", "🌱", "🤖", "⏰", "🛍️", "👥"];
              const emojiIndex = menuItems.findIndex(m => m.path === item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl transition-all duration-300 font-fun font-medium hover-bounce ${
                    isActive(item.path)
                      ? "bg-gradient-primary text-primary-foreground shadow-fun border-2 border-primary-glow scale-105"
                      : "text-muted-foreground hover:text-primary hover:bg-primary-soft border-2 border-transparent hover:border-primary/30"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                  <span className="text-sm">{emojis[emojiIndex]}</span>
                </Link>
              );
            })}
            
            {/* Member Login Button */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('/login', '_blank', 'width=500,height=700,scrollbars=yes,resizable=yes')}
              className="ml-2 border-2 border-primary/30 hover:border-primary"
            >
              <User className="h-4 w-4 mr-2" />
              Member
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
            <Button variant="fun" size="icon" className="rounded-2xl">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-gradient-card">
            <div className="flex flex-col space-y-4 mt-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2.5 bg-gradient-fun rounded-2xl shadow-fun">
                  <img src="/lovable-uploads/16156f1e-2e79-486b-bb1a-132d152f1756.png" alt="Manggrow Logo" className="h-7 w-7" />
                </div>
                <span className="text-xl font-game font-bold text-foreground">Manggrow 🌱</span>
              </div>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const emojis = ["🏠", "🌱", "🤖", "⏰", "🛍️", "👥"];
                const emojiIndex = menuItems.findIndex(m => m.path === item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 font-fun font-medium ${
                      isActive(item.path)
                        ? "bg-gradient-primary text-primary-foreground shadow-fun"
                        : "text-muted-foreground hover:text-primary hover:bg-primary-soft"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    <span>{emojis[emojiIndex]}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Member Login Button */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setOpen(false);
                  window.open('/login', '_blank', 'width=500,height=700,scrollbars=yes,resizable=yes');
                }}
                className="w-full mt-4 border-2 border-primary/30"
              >
                <User className="h-4 w-4 mr-2" />
                Member Login
              </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Auth Sidebar */}
      <AuthSidebar 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />
    </nav>
  );
};

export default Navigation;