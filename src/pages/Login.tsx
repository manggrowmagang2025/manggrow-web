import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import {
  LogIn,
  LogOut,
  User as UserIcon,
  Mail,
  Lock,
  Leaf,
  Settings,
  UserPlus,
  ArrowLeft,
  Shield
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Login: React.FC = () => {
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const navigate = useNavigate();
  const [isInitiallyAuthenticated] = useState(isAuthenticated);
  console.log('Login render:', { user, isAuthenticated });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [welcomeShown, setWelcomeShown] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    // Don't auto-redirect if user was already logged in when visiting the page
    if (isInitiallyAuthenticated) return;

    if (user && !welcomeShown) {
      setWelcomeShown(true);
      toast({
        title: "Welcome! 🌱",
        description: "Berhasil masuk ke akun Anda",
      });

      setTimeout(() => {
        if (user.role === 'admin') {
          navigate('/admin/products');
        } else {
          navigate('/');
        }
      }, 1500);
    }
  }, [user, welcomeShown, navigate, isInitiallyAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(loginEmail, loginPassword);
      setLoginEmail('');
      setLoginPassword('');
      // Navigation handled by useEffect
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal masuk ke akun",
        variant: "destructive",
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
        variant: "destructive",
      });
      return;
    }

    if (signupPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password minimal 6 karakter",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await register(signupName, signupEmail, signupPassword);
      toast({
        title: "Akun berhasil dibuat! 🎉",
        description: "Anda sudah otomatis masuk ke akun.",
      });
      setSignupEmail('');
      setSignupPassword('');
      setConfirmPassword('');
      setSignupName('');

      setActiveTab('login');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal membuat akun",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Goodbye! 👋",
        description: "Berhasil keluar dari akun",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal keluar dari akun",
        variant: "destructive",
      });
    }
  };

  const getUserInitials = (name?: string, email?: string) => {
    if (name && name.length > 0) return name.charAt(0).toUpperCase();
    if (email && email.length > 0) return email.charAt(0).toUpperCase();
    return '?';
  };

  const handleBackToMain = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-fun rounded-2xl shadow-fun">
              <img src="/lovable-uploads/16156f1e-2e79-486b-bb1a-132d152f1756.png" alt="Manggrow Logo" className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Manggrow 🌱</h1>
              <p className="text-sm text-muted-foreground">Member Area</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToMain}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali</span>
          </Button>
        </div>

        {/* Main Content */}
        <div className="max-w-md mx-auto">
          {isAuthenticated && user ? (
            // Authenticated User View
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <Avatar className="h-20 w-20 mx-auto mb-4">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                        {getUserInitials(user.name, user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>

                  <Separator />

                  {user.role === 'admin' ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Shield className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Status Akun</p>
                          <p className="text-xs text-muted-foreground">Administrator 🛠️</p>
                        </div>
                      </div>

                      <Button
                        variant="default"
                        className="w-full justify-start"
                        onClick={() => navigate('/admin/products')}
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Dashboard Admin
                      </Button>
                    </div>
                  ) : (
                    <>
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
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => navigate('/my-plants')}
                        >
                          <Leaf className="h-4 w-4 mr-3" />
                          Tanaman Saya
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => navigate('/reminders')}
                        >
                          <Settings className="h-4 w-4 mr-3" />
                          Pengingat
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => navigate('/products')}
                        >
                          <UserIcon className="h-4 w-4 mr-3" />
                          Rekomendasi
                        </Button>
                      </div>
                    </>
                  )}

                  <Separator />

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Keluar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Authentication Forms
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
                            placeholder="Password Anda"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Masuk...' : 'Masuk'}
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
                      Bergabung dengan komunitas plant lovers!
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
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="nama@email.com"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="Minimal 6 karakter"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            className="pl-10"
                            required
                            minLength={6}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="confirm-password"
                            type="password"
                            placeholder="Ulangi password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
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
  );
};

export default Login;
