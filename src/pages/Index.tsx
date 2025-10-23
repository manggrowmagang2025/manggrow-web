import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-plants.jpg";
import { 
  Leaf, 
  Bell, 
  ShoppingBag, 
  Users, 
  Calendar,
  Droplets,
  Sun,
  Heart,
  ArrowRight,
  Smartphone,
  Download,
  Instagram,
  Music
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Leaf,
      title: "Kelola Tanaman",
      description: "Catat dan pantau semua tanaman Anda dengan mudah",
      color: "text-primary"
    },
    {
      icon: Bell,
      title: "Pengingat Cerdas", 
      description: "Dapatkan notifikasi untuk penyiraman dan pemupukan",
      color: "text-accent"
    },
    {
      icon: ShoppingBag,
      title: "Rekomendasi Produk",
      description: "Temukan alat dan pupuk terbaik untuk tanaman Anda",
      color: "text-blue-500"
    },
    {
      icon: Users,
      title: "Komunitas",
      description: "Bergabung dengan komunitas pecinta tanaman",
      color: "text-green-600"
    }
  ];

  const tips = [
    {
      icon: Droplets,
      tip: "Siram tanaman di pagi hari untuk hasil terbaik"
    },
    {
      icon: Sun,
      tip: "Pastikan tanaman mendapat cahaya yang cukup"
    },
    {
      icon: Heart,
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
                <div className="flex items-center space-x-4">
                  <div className="bg-green-800 rounded-full p-3 animate-float">
                    <Leaf className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-black font-game text-xl">Halo, Gardener! 🌱</h2>
                    <p className="text-black font-fun">Mari berkebun hari ini!</p>
                  </div>
                </div>
              </Card>

              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-game font-bold text-foreground leading-tight">
                  <span className="bg-gradient-fun bg-clip-text text-transparent animate-pulse-fun">
                    Manggrow
                  </span>
                  <br />
                  <span className="text-2xl lg:text-4xl text-foreground font-fun">
                    AI Plantcare Assistant 🤖
                  </span>
                </h1>
                <p className="text-xl text-foreground max-w-lg font-fun">
                  Aplikasi super fun untuk mencatat, merawat, dan memantau tanaman kamu! 
                  Perfect buat pemula yang mau belajar berkebun! 🌿✨
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/my-plants">
                  <Button size="lg" variant="hero" className="w-full sm:w-auto font-game">
                    🚀 Mulai Berkebun
                    <ArrowRight className="h-6 w-6" />
                  </Button>
                </Link>
                <Link to="/konsultasi">
                  <Button size="lg" variant="fun" className="w-full sm:w-auto font-game">
                    🤖 Chat dengan AI
                  </Button>
                </Link>
                <Link to="/community">
                  <Button size="lg" variant="playful" className="w-full sm:w-auto font-game">
                    👥 Join Komunitas
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
                {/* Cute decorative elements */}
                <div className="absolute -top-4 -right-4 bg-accent rounded-full p-3 shadow-fun animate-wiggle">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-primary rounded-full p-3 shadow-fun animate-bounce">
                  <Sun className="h-6 w-6 text-white" />
                </div>
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
              🎮 Fitur Super Keren! ✨
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-fun">
              Solusi lengkap untuk merawat tanaman dengan teknologi AI yang fun!
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const emojis = ["🌱", "🔔", "🛍️", "👥"];
              return (
                <Card key={index} className="group hover-bounce hover:shadow-fun transition-all duration-300 hover:border-primary/40 bg-gradient-card border-3 border-primary/20">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">
                      <div className="inline-flex p-4 rounded-3xl bg-gradient-primary shadow-lg relative">
                        <Icon className="h-8 w-8 text-white" />
                        <span className="absolute -top-2 -right-2 text-2xl animate-wiggle">
                          {emojis[index]}
                        </span>
                      </div>
                    </div>
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
              💡 Tips Berkebun Hari Ini ✨
            </h2>
            <p className="text-lg text-muted-foreground font-fun">
              Tips praktis dan fun untuk merawat tanaman kamu!
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {tips.map((tip, index) => {
              const Icon = tip.icon;
              const tipEmojis = ["💧", "☀️", "💚"];
              return (
                <Card key={index} className="group hover-bounce hover:shadow-fun transition-all duration-300 border-3 border-accent/20 bg-gradient-card hover:border-accent/40">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 rounded-2xl bg-gradient-accent shadow-lg relative">
                        <Icon className="h-6 w-6 text-white" />
                        <span className="absolute -top-1 -right-1 text-lg animate-pulse-fun">
                          {tipEmojis[index]}
                        </span>
                      </div>
                      <p className="text-foreground font-fun font-medium text-base">
                        {tip.tip}
                      </p>
                    </div>
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
          
          {/* Fun floating elements */}
          <div className="absolute top-10 left-10 animate-float">
            <div className="bg-white/20 rounded-full p-4">
              <Leaf className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="absolute top-20 right-10 animate-wiggle">
            <div className="bg-white/20 rounded-full p-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-game font-bold text-black mb-4">
            🎉 Siap Jadi Plant Parent? 🌱
          </h2>
          <p className="text-xl text-black mb-8 max-w-2xl mx-auto font-fun">
            Join ribuan gardener pemula yang udah sukses merawat tanaman mereka dengan fun!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/my-plants">
              <Button size="lg" className="bg-orange-700 text-white hover:bg-orange-800 shadow-fun font-game hover-bounce">
                <Calendar className="h-6 w-6 mr-2" />
                🌱 Tambah Tanaman Pertama
              </Button>
            </Link>
            <Link to="/konsultasi">
              <Button size="lg" className="bg-orange-700 text-white hover:bg-orange-800 border-0 font-game hover-wiggle">
                🤖 Chat AI Gratis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Section - Download & Social Links */}
      <footer className="bg-muted/50 py-12 lg:py-16">
        <div className="container mx-auto px-4">
          {/* Download App Section - Similar to reference */}
          <div className="text-center mb-12 bg-muted/50 rounded-3xl p-8">
            <h2 className="text-2xl lg:text-3xl font-game font-bold text-foreground mb-4">
              Download the app
            </h2>
            <p className="text-lg text-muted-foreground mb-8 font-fun max-w-lg mx-auto">
              The Manggrow app is available for both iOS and Android devices.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* App Store Badges */}
              <div className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-3 hover:bg-black/90 transition-colors cursor-pointer shadow-lg">
                <div className="text-2xl">🍎</div>
                <div className="text-left">
                  <div className="text-xs opacity-80">Download on the</div>
                  <div className="text-lg font-bold">App Store</div>
                </div>
              </div>
              
              <div className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-3 hover:bg-black/90 transition-colors cursor-pointer shadow-lg">
                <div className="text-2xl">▶️</div>
                <div className="text-left">
                  <div className="text-xs opacity-80">GET IT ON</div>
                  <div className="text-lg font-bold">Google Play</div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media & Marketplace Links */}
          <div className="text-center mb-8">
            <h3 className="text-xl font-game font-bold text-foreground mb-6">
              🌟 Ikuti Kami & Belanja di
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {/* Social Media */}
              <Card className="group hover-bounce hover:shadow-fun transition-all duration-300 border-2 border-primary/20 bg-gradient-card hover:border-primary/40">
                <CardContent className="p-4 text-center">
                  <div className="mb-2">
                    <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg">
                      <Instagram className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm font-game font-bold text-primary">Instagram</p>
                </CardContent>
              </Card>

              <Card className="group hover-bounce hover:shadow-fun transition-all duration-300 border-2 border-primary/20 bg-gradient-card hover:border-primary/40">
                <CardContent className="p-4 text-center">
                  <div className="mb-2">
                    <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-black to-gray-800 shadow-lg">
                      <Music className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm font-game font-bold text-primary">TikTok</p>
                </CardContent>
              </Card>

              {/* Marketplace */}
              <Card className="group hover-bounce hover:shadow-fun transition-all duration-300 border-2 border-accent/20 bg-gradient-card hover:border-accent/40">
                <CardContent className="p-4 text-center">
                  <div className="mb-2">
                    <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg">
                      <ShoppingBag className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm font-game font-bold text-accent">Shopee</p>
                </CardContent>
              </Card>

              <Card className="group hover-bounce hover:shadow-fun transition-all duration-300 border-2 border-accent/20 bg-gradient-card hover:border-accent/40">
                <CardContent className="p-4 text-center">
                  <div className="mb-2">
                    <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-black to-gray-800 shadow-lg">
                      <ShoppingBag className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm font-game font-bold text-primary">TikTok Shop</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Powered By Text */}
          <div className="text-center border-t border-muted/20 pt-8">
            <p className="text-muted-foreground font-fun text-sm">
              🌱 <span className="font-game font-bold text-primary">Powered by Manggrow Official Store</span> 🌱
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;