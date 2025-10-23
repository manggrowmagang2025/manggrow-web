import React, { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  ArrowLeft
} from 'lucide-react';

const Login: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Auth state cleanup utility
  const cleanupAuthState = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          toast({
            title: "Welcome! 🌱",
            description: "Berhasil masuk ke akun Anda",
          });
          // Redirect to main page and close this tab
          setTimeout(() => {
            window.opener?.location.reload();
            window.close();
          }, 1500);
        }

        if (event === 'SIGNED_OUT') {
          toast({
            title: "Goodbye! 👋",
            description: "Berhasil keluar dari akun",
          });
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        let errorMessage = "Gagal masuk ke akun";
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Email atau password salah";
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "Silakan konfirmasi email Anda terlebih dahulu";
        } else if (error.message.includes('Too many requests')) {
          errorMessage = "Terlalu banyak percobaan. Coba lagi nanti";
        }
        throw new Error(errorMessage);
      }

      if (data.user) {
        setLoginEmail('');
        setLoginPassword('');
      }
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
      cleanupAuthState();

      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        let errorMessage = "Gagal membuat akun";
        if (error.message.includes('User already registered')) {
          errorMessage = "Email sudah terdaftar. Silakan masuk atau gunakan email lain";
        } else if (error.message.includes('Signup is disabled')) {
          errorMessage = "Pendaftaran sementara ditutup. Coba lagi nanti";
        } else if (error.message.includes('Password should be')) {
          errorMessage = "Password terlalu lemah. Gunakan minimal 6 karakter";
        }
        throw new Error(errorMessage);
      }

      toast({
        title: "Akun berhasil dibuat! 🎉",
        description: data.user?.email_confirmed_at 
          ? "Akun siap digunakan!" 
          : "Silakan periksa email Anda untuk konfirmasi",
      });

      setSignupEmail('');
      setSignupPassword('');
      setConfirmPassword('');
      
      if (!data.user?.email_confirmed_at) {
        setActiveTab('login');
      }
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
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      window.opener?.location.reload();
      window.close();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal keluar dari akun",
        variant: "destructive",
      });
      
      cleanupAuthState();
      setTimeout(() => {
        window.close();
      }, 1000);
    }
  };

  const getUserInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const handleBackToMain = () => {
    if (window.opener) {
      window.close();
    } else {
      window.location.href = '/';
    }
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
          {user ? (
            // Authenticated User View
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <Avatar className="h-20 w-20 mx-auto mb-4">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                        {getUserInitials(user.email || '')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold">{user.user_metadata?.full_name || 'Member'}</h3>
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
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        window.opener && (window.opener.location.href = '/my-plants');
                        window.close();
                      }}
                    >
                      <Leaf className="h-4 w-4 mr-3" />
                      Tanaman Saya
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        window.opener && (window.opener.location.href = '/reminders');
                        window.close();
                      }}
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Pengingat
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        window.opener && (window.opener.location.href = '/products');
                        window.close();
                      }}
                    >
                      <UserIcon className="h-4 w-4 mr-3" />
                      Rekomendasi
                    </Button>
                  </div>

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