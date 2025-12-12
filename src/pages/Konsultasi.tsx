import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Bot, Leaf, Sparkles } from "lucide-react";
import { useEffect } from "react";
import "@n8n/chat/dist/style.css";
import { createChat } from "@n8n/chat";

const Konsultasi = () => {
  useEffect(() => {
    // Initialize n8n chat
    createChat({
      webhookUrl: 'https://bejec23498.app.n8n.cloud/webhook/581d9836-f44f-4dc1-bd5a-dfe95a51d948/chat',
      target: '#n8n-chat',
      mode: 'fullscreen',
      showWelcomeScreen: true,
      initialMessages: [
        'Halo! Saya Manggrow Assistant 🌱',
        'Saya siap membantu Anda dengan segala pertanyaan tentang perawatan tanaman. Apa yang ingin Anda tanyakan hari ini?'
      ],
      i18n: {
        en: {
          title: 'Manggrow Assistant',
          subtitle: 'AI Asisten Berkebun',
          footer: '',
          getStarted: 'Mulai Chat',
          inputPlaceholder: 'Tanyakan tentang tanaman Anda...',
          closeButtonTooltip: 'Tutup Chat',
        },
      },
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex p-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full mb-6">
              <Bot className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-game font-bold text-foreground mb-4">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                🤖 Konsultasi dengan AI
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-fun">
              Dapatkan saran ahli untuk merawat tanaman cantik Anda dari AI yang terlatih khusus untuk berkebun! 🌱✨
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg font-game">💬 Chat Langsung</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-fun">Tanyakan langsung tentang masalah tanaman Anda 🗣️</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-lg font-game">🌿 Diagnosa Tanaman</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-fun">Identifikasi penyakit dan masalah pertumbuhan 🔍</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg font-game">🎯 Saran Personal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-fun">Rekomendasi perawatan sesuai jenis tanaman Anda 💡</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Interface */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Chat Area */}
            <div className="lg:col-span-2">
              <div id="n8n-chat" className="h-[600px] rounded-xl overflow-hidden border border-border/50 shadow-lg bg-card"></div>
            </div>

            {/* Sidebar with Tips */}
            <div className="space-y-6">
              {/* AI Features */}
              <Card className="bg-gradient-to-br from-primary-soft/30 to-accent-soft/30 border-border/30">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg font-game">✨ Fitur AI</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p className="text-sm text-foreground">Diagnosa penyakit tanaman dengan akurat</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <p className="text-sm text-foreground">Rekomendasi perawatan personal</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p className="text-sm text-foreground">Tips berkebun untuk pemula</p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Questions */}
              <Card className="border-border/30">
                <CardHeader>
                  <CardTitle className="text-lg font-game">❓ Pertanyaan Populer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <button className="w-full text-left p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-sm">
                    "Mengapa daun tanaman saya menguning?"
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-sm">
                    "Seberapa sering harus menyiram tanaman?"
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-sm">
                    "Tanaman terbaik untuk pemula?"
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-sm">
                    "Cara mengatasi hama pada tanaman?"
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Educational Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-game font-bold text-center mb-8">💡 Tips Perawatan Tanaman</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-border/30 bg-card/50">
                <CardContent className="p-6">
                  <h3 className="font-game font-bold mb-3 text-primary flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    🚨 Masalah Umum Tanaman
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-warning rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Daun menguning:</strong> Kemungkinan kelebihan air atau kekurangan nutrisi</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-destructive rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Daun layu:</strong> Kekurangan air, cahaya, atau stress lingkungan</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-info rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Pertumbuhan lambat:</strong> Butuh pupuk atau pencahayaan lebih baik</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Bercak daun:</strong> Kemungkinan penyakit jamur atau bakteri</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-border/30 bg-card/50">
                <CardContent className="p-6">
                  <h3 className="font-game font-bold mb-3 text-accent flex items-center">
                    <Leaf className="h-5 w-5 mr-2" />
                    🌱 Perawatan Dasar
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Penyiraman:</strong> Siram saat tanah terasa kering, hindari genangan</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-success rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Drainase:</strong> Pastikan pot memiliki lubang untuk air keluar</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-warning rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Pencahayaan:</strong> Sesuaikan dengan kebutuhan spesies tanaman</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Pemupukan:</strong> Berikan pupuk sesuai jadwal dan kebutuhan</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Konsultasi;