import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-plants.jpg";
import {
  Leaf,
  ShoppingBag,
  Instagram,
  Music
} from "lucide-react";

const Index = () => {
  const features = [
    {
      title: "Kelola Tanaman",
      description: "Catat dan pantau semua tanaman Anda dengan mudah",
      color: "text-primary"
    },
    {
      title: "Pengingat Cerdas",
      description: "Dapatkan notifikasi untuk penyiraman dan pemupukan",
      color: "text-accent"
    },
    {
      title: "Rekomendasi Produk",
      description: "Temukan alat dan pupuk terbaik untuk tanaman Anda",
      color: "text-blue-500"
    },
    {
      title: "Komunitas",
      description: "Bergabung dengan komunitas pecinta tanaman",
      color: "text-green-600"
    }
  ];

  const tips = [
    {
      tip: "Siram tanaman di pagi hari untuk hasil terbaik"
    },
    {
      tip: "Pastikan tanaman mendapat cahaya yang cukup"
    },
    {
      tip: "Perhatikan kondisi daun untuk mendeteksi masalah dini"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />

      {/* Hero Section - Game Style */}
      <section className="relative overflow-hidden bg-muted/30">
        <div className="container mx-auto px-4 py-8 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 animate-bounce-in">
              {/* Greeting Card */}
              <Card className="bg-white p-6 border-0 shadow-fun">
                <div>
                  <h2 className="text-black font-game text-xl">Halo, Gardener!</h2>
                  <p className="text-black font-fun">Mari berkebun hari ini!</p>
                </div>
              </Card>

              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-game font-bold text-foreground leading-tight">
                  <span className="bg-gradient-fun bg-clip-text text-transparent animate-pulse-fun">
                    Manggrow
                  </span>
                  <br />
                  <span className="text-2xl lg:text-4xl text-foreground font-fun">
                    AI Plantcare Assistant
                  </span>
                </h1>
                <p className="text-xl text-foreground max-w-lg font-fun">
                  Aplikasi super fun untuk mencatat, merawat, dan memantau tanaman kamu!
                  Perfect buat pemula yang mau belajar berkebun!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/my-plants">
                  <Button size="lg" variant="hero" className="w-full sm:w-auto font-game">
                    Mulai Berkebun
                  </Button>
                </Link>
                <Link to="/konsultasi">
                  <Button size="lg" variant="fun" className="w-full sm:w-auto font-game">
                    Chat dengan AI
                  </Button>
                </Link>
                <Link to="/community">
                  <Button size="lg" variant="playful" className="w-full sm:w-auto font-game">
                    Join Komunitas
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative animate-float">
              <div className="absolute inset-0 bg-gradient-fun rounded-3xl blur-3xl opacity-30"></div>
              <div className="relative bg-gradient-card rounded-3xl shadow-fun p-2 border-4 border-primary/20">
                <img
                  src={heroImage}
                  alt="Beautiful plants for gardening"
                  className="rounded-2xl w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Game Style */}
      <section className="py-12 lg:py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-game font-bold text-foreground mb-4">
              Fitur Super Keren!
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-fun">
              Solusi lengkap untuk merawat tanaman dengan teknologi AI yang fun!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              return (
                <Card key={index} className="group hover-bounce hover:shadow-fun transition-all duration-300 hover:border-primary/40 bg-gradient-card border-3 border-primary/20">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-game font-bold text-primary mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground font-fun text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tips Section - Game Style */}
      <section className="py-12 lg:py-16 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-game font-bold text-foreground mb-4">
              Tips Berkebun Hari Ini
            </h2>
            <p className="text-lg text-muted-foreground font-fun">
              Tips praktis dan fun untuk merawat tanaman kamu!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {tips.map((tip, index) => {
              return (
                <Card key={index} className="group hover-bounce hover:shadow-fun transition-all duration-300 border-3 border-accent/20 bg-gradient-card hover:border-accent/40">
                  <CardContent className="p-6">
                    <p className="text-foreground font-fun font-medium text-base">
                      {tip.tip}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section - Game Style */}
      <section className="py-16 lg:py-20 bg-gradient-fun relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl -z-10"></div>

          <h2 className="text-3xl lg:text-4xl font-game font-bold text-black mb-4">
            Siap Jadi Plant Parent?
          </h2>
          <p className="text-xl text-black mb-8 max-w-2xl mx-auto font-fun">
            Join ribuan gardener pemula yang udah sukses merawat tanaman mereka dengan fun!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/my-plants">
              <Button size="lg" className="bg-orange-700 text-white hover:bg-orange-800 shadow-fun font-game hover-bounce">
                Tambah Tanaman Pertama
              </Button>
            </Link>
            <Link to="/konsultasi">
              <Button size="lg" className="bg-orange-700 text-white hover:bg-orange-800 border-0 font-game hover-wiggle">
                Chat AI Gratis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Section - Download & Social Links */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xl font-bold text-foreground">Manggrow</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                Solusi lengkap untuk merawat tanaman dengan teknologi AI.
                Mari hijaukan bumi, satu tanaman setiap hari.
              </p>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Ikuti Kami</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                    <Instagram className="h-4 w-4" />
                    <span>Instagram</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                    <Music className="h-4 w-4" />
                    <span>TikTok</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Marketplace */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Official Store</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                    <ShoppingBag className="h-4 w-4" />
                    <span>Shopee</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                    <ShoppingBag className="h-4 w-4" />
                    <span>TikTok Shop</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Manggrow. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Powered by Manggrow Official Store
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;