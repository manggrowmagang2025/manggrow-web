import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { 
  ExternalLink, 
  Users, 
  BookOpen, 
  MessageCircle, 
  Youtube, 
  Instagram,
  Globe,
  Star,
  Clock,
  Heart
} from "lucide-react";

const Community = () => {
  const communityLinks = [
    {
      title: "Grup Facebook Pecinta Tanaman Indonesia",
      description: "Komunitas terbesar pecinta tanaman di Indonesia dengan lebih dari 100K anggota",
      url: "https://facebook.com/groups/pecintatanamanhias",
      members: "100K+",
      platform: "Facebook",
      icon: MessageCircle,
      color: "bg-blue-500"
    },
    {
      title: "Forum Berkebun Indonesia",
      description: "Forum diskusi lengkap tentang tips berkebun, jual beli tanaman, dan sharing pengalaman",
      url: "https://forumberkebun.com",
      members: "50K+",
      platform: "Forum",
      icon: Globe,
      color: "bg-green-500"
    },
    {
      title: "Instagram @tanamanhias.id",
      description: "Follow untuk tips harian, inspirasi dekorasi tanaman, dan konten edukatif",
      url: "https://instagram.com/tanamanhias.id",
      members: "200K+",
      platform: "Instagram",
      icon: Instagram,
      color: "bg-pink-500"
    },
    {
      title: "WhatsApp Group Pemula Berkebun",
      description: "Grup khusus pemula untuk bertanya dan sharing pengalaman berkebun",
      url: "https://chat.whatsapp.com/pemulaberkebun",
      members: "5K+",
      platform: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-600"
    }
  ];

  const tutorials = [
    {
      title: "Cara Merawat Tanaman Hias untuk Pemula",
      description: "Tutorial lengkap dari A-Z merawat tanaman hias di rumah",
      url: "https://youtube.com/watch?v=tutorial1",
      duration: "15 menit",
      rating: 4.8,
      thumbnail: "🌱",
      platform: "YouTube"
    },
    {
      title: "Tips Penyiraman yang Benar",
      description: "Panduan praktis kapan dan bagaimana menyiram tanaman dengan benar",
      url: "https://youtube.com/watch?v=tutorial2",
      duration: "10 menit",
      rating: 4.9,
      thumbnail: "💧",
      platform: "YouTube"
    },
    {
      title: "Mengatasi Hama dan Penyakit Tanaman",
      description: "Cara mengenali dan mengatasi masalah umum pada tanaman hias",
      url: "https://youtube.com/watch?v=tutorial3",
      duration: "20 menit",
      rating: 4.7,
      thumbnail: "🐛",
      platform: "YouTube"
    },
    {
      title: "Propagasi Tanaman: Cara Memperbanyak Tanaman",
      description: "Teknik propagasi untuk berbagai jenis tanaman hias",
      url: "https://youtube.com/watch?v=tutorial4",
      duration: "18 menit",
      rating: 4.6,
      thumbnail: "🌿",
      platform: "YouTube"
    },
    {
      title: "Pemilihan Pot dan Media Tanam",
      description: "Panduan memilih pot yang tepat dan media tanam yang baik",
      url: "https://youtube.com/watch?v=tutorial5",
      duration: "12 menit",
      rating: 4.5,
      thumbnail: "🪴",
      platform: "YouTube"
    },
    {
      title: "Tanaman Indoor yang Mudah Dirawat",
      description: "Rekomendasi tanaman indoor terbaik untuk pemula",
      url: "https://youtube.com/watch?v=tutorial6",
      duration: "14 menit",
      rating: 4.8,
      thumbnail: "🏠",
      platform: "YouTube"
    }
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-3 w-3 fill-yellow-400/50 text-yellow-400" />);
    }

    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="text-xs text-muted-foreground ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-game font-bold text-foreground mb-4">
            👥 Komunitas & Tutorial Berkebun
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-fun">
            Bergabunglah dengan komunitas pecinta tanaman dan pelajari tips berkebun dari para ahli! 🌱📚
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Community Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-game font-bold text-foreground">👥 Komunitas</h2>
            </div>

            <div className="space-y-4">
              {communityLinks.map((community, index) => {
                const Icon = community.icon;
                return (
                  <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${community.color} text-white`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg leading-tight">
                              {community.title}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary">{community.platform}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {community.members} anggota
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground text-sm">
                        {community.description}
                      </p>
                      
                      <Button 
                        variant="fun" 
                        className="w-full hover-bounce"
                        onClick={() => window.open(community.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        🚀 Bergabung
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Tutorial Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-accent/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
              <h2 className="text-2xl font-game font-bold text-foreground">📚 Tutorial & Edukasi</h2>
            </div>

            <div className="space-y-4">
              {tutorials.map((tutorial, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="text-3xl">{tutorial.thumbnail}</div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-foreground leading-tight">
                            {tutorial.title}
                          </h3>
                          <Badge variant="secondary" className="ml-2">
                            <Youtube className="h-3 w-3 mr-1" />
                            {tutorial.platform}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {tutorial.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {tutorial.duration}
                              </span>
                            </div>
                            {renderStars(tutorial.rating)}
                          </div>
                          
                          <Button 
                            size="sm" 
                            variant="accent"
                            className="hover-bounce"
                            onClick={() => window.open(tutorial.url, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            ▶️ Tonton
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-16 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-game font-bold text-foreground">
                💡 Tips Bergabung dengan Komunitas
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h3 className="font-semibold">Aktif Bertanya</h3>
                <p className="text-sm text-muted-foreground">
                  Jangan ragu untuk bertanya tentang masalah tanaman Anda
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-accent font-bold">2</span>
                </div>
                <h3 className="font-semibold">Berbagi Pengalaman</h3>
                <p className="text-sm text-muted-foreground">
                  Share foto dan cerita sukses berkebun Anda
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary-glow/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary-glow font-bold">3</span>
                </div>
                <h3 className="font-semibold">Saling Membantu</h3>
                <p className="text-sm text-muted-foreground">
                  Bantu sesama anggota komunitas yang mengalami kesulitan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;