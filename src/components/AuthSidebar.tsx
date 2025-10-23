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
  UserPlus
} from 'lucide-react';

interface AuthSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthSidebar: React.FC<AuthSidebarProps> = ({ isOpen, onClose }) => {
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
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    // Remove from sessionStorage if in use
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Only synchronous state updates here
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          toast({
            title: "Welcome! 🌱",
            description: "Berhasil masuk ke akun Anda",
          });
          onClose();
        }

        if (event === 'SIGNED_OUT') {
          toast({
            title: "Goodbye! 👋",
            description: "Berhasil keluar dari akun",
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [onClose]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clean up existing state first
      cleanupAuthState();
      
      // Attempt global sign out to clear any existing session
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
        // Handle specific auth errors
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
        // Clear form on successful login
        setLoginEmail('');
        setLoginPassword('');
        // Force page reload for clean state
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
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
      // Clean up existing state first
      cleanupAuthState();

      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        // Handle specific signup errors
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

      // Clear form
      setSignupEmail('');
      setSignupPassword('');
      setConfirmPassword('');
      
      // Switch to login tab if email confirmation needed
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
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      // Force page reload for clean state
      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal keluar dari akun",
        variant: "destructive",
      });
      
      // Still try to clean state and reload on error
      cleanupAuthState();
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }
  };

  const getUserInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-xl border-l">
        <div className="flex h-full flex-col">
          {/* Header */}
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

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {user ? (
              // Authenticated User View
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
                    onClick={() => window.location.href = '/my-plants'}
                  >
                    <Leaf className="h-4 w-4 mr-3" />
                    Tanaman Saya
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => window.location.href = '/reminders'}
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Pengingat
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => window.location.href = '/products'}
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
    </div>
  );
};

export default AuthSidebar;