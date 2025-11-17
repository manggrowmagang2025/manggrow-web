import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  LogIn,
  LogOut,
  User as UserIcon,
  Mail,
  Lock,
  Leaf,
  Settings,
  UserPlus
} from "lucide-react";

interface AuthSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthSidebar = ({ isOpen, onClose }: AuthSidebarProps) => {
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      toast({ title: "Selamat datang! 🌱", description: "Anda berhasil masuk." });
      setLoginEmail("");
      setLoginPassword("");
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal masuk ke akun",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Password tidak cocok",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      await register(signupName, signupEmail, signupPassword);
      toast({
        title: "Akun berhasil dibuat! 🎉",
        description: "Anda sudah otomatis masuk ke akun."
      });
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
      setConfirmPassword("");
      setActiveTab("login");
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal membuat akun",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: "Sampai jumpa! 👋", description: "Anda telah keluar." });
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal keluar dari akun",
        variant: "destructive"
      });
    }
  };

  const getInitials = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "?";
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-xl border-l">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Member Area</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {isAuthenticated && user ? (
              <div className="space-y-6">
                <div className="text-center">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Leaf className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Status Member</p>
                      <p className="text-xs text-muted-foreground">Aktif - Plant Lover 🌱</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Card className="p-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">0</p>
                        <p className="text-xs text-muted-foreground">Tanaman</p>
                      </div>
                    </Card>
                    <Card className="p-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-accent">0</p>
                        <p className="text-xs text-muted-foreground">Reminder</p>
                      </div>
                    </Card>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => window.location.href = "/my-plants"}>
                    <Leaf className="h-4 w-4 mr-3" />
                    Tanaman Saya
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => window.location.href = "/reminders"}>
                    <Settings className="h-4 w-4 mr-3" />
                    Pengingat
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => window.location.href = "/products"}>
                    <UserIcon className="h-4 w-4 mr-3" />
                    Rekomendasi
                  </Button>
                </div>

                <Separator />

                <Button variant="outline" className="w-full" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Keluar
                </Button>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Masuk</TabsTrigger>
                  <TabsTrigger value="signup">Daftar</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <LogIn className="h-5 w-5" />
                        <span>Masuk ke Akun</span>
                      </CardTitle>
                      <CardDescription>
                        Masuk untuk mengakses fitur lengkap Manggrow
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="login-email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="login-email"
                              type="email"
                              placeholder="nama@email.com"
                              value={loginEmail}
                              onChange={(e) => setLoginEmail(e.target.value)}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="login-password">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="login-password"
                              type="password"
                              placeholder="••••••••"
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                          Masuk
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="signup">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <UserPlus className="h-5 w-5" />
                        <span>Buat Akun Baru</span>
                      </CardTitle>
                      <CardDescription>
                        Bergabung untuk menyimpan tanaman favorit Anda
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-name">Nama Lengkap</Label>
                          <Input
                            id="signup-name"
                            placeholder="Nama Anda"
                            value={signupName}
                            onChange={(e) => setSignupName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-email">Email</Label>
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="nama@email.com"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-password">Password</Label>
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="Minimal 6 karakter"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            placeholder="Ulangi password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                          Daftar
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSidebar;
