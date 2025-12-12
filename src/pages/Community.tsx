
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { supabase } from "@/lib/supabaseClient";
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
  Heart,
  Facebook,
  Twitter
} from "lucide-react";

// Icon mapping for dynamic rendering
const iconMap: { [key: string]: any } = {
  MessageCircle,
  Globe,
  Instagram,
  Youtube,
  Users,
  Facebook,
  Twitter
};

interface CommunityLink {
  id: number;
  title: string;
  description: string;
  url: string;
  members: string;
  platform: string;
  icon_name: string;
  color_class: string;
}

interface Tutorial {
  id: number;
  title: string;
  description: string;
  url: string;
  duration: string;
  rating: number;
  thumbnail: string;
  platform: string;
}

const Community = () => {
  const [communityLinks, setCommunityLinks] = useState<CommunityLink[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: communitiesData } = await supabase.from('communities').select('*').order('id', { ascending: true });
      const { data: tutorialsData } = await supabase.from('tutorials').select('*').order('id', { ascending: true });

      if (communitiesData) setCommunityLinks(communitiesData);
      if (tutorialsData) setTutorials(tutorialsData);
    } catch (error) {
      console.error("Error fetching community data:", error);
    } finally {
      setLoading(false);
    }
  };

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
              {loading ? (
                <p className="text-muted-foreground text-center py-8">Memuat komunitas...</p>
              ) : communityLinks.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Belum ada komunitas yang terdaftar.</p>
              ) : (
                communityLinks.map((community, index) => {
                  const Icon = iconMap[community.icon_name] || Globe;
                  return (
                    <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${community.color_class} text-white`}>
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
                })
              )}
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
              {loading ? (
                <p className="text-muted-foreground text-center py-8">Memuat tutorial...</p>
              ) : tutorials.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Belum ada tutorial.</p>
              ) : (
                tutorials.map((tutorial, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="text-3xl">{tutorial.thumbnail}</div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-foreground leading-tight">
                              {tutorial.title}
                            </h3>
                            <Badge variant="secondary" className="ml-2 hidden sm:inline-flex">
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
                              <span className="hidden sm:inline">Tonton</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
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