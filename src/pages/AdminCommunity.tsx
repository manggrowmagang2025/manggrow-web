
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit, Loader2, Users, BookOpen } from "lucide-react";
import Navigation from "@/components/Navigation";

// Interfaces
interface Community {
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

const AdminCommunity = () => {
    const { user, isAdmin } = useAuth();
    const isAuthenticated = !!user;
    const [communities, setCommunities] = useState<Community[]>([]);
    const [tutorials, setTutorials] = useState<Tutorial[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("communities");

    // State for Dialogs
    const [isCommunityDialogOpen, setIsCommunityDialogOpen] = useState(false);
    const [isTutorialDialogOpen, setIsTutorialDialogOpen] = useState(false);
    const [editingCommunity, setEditingCommunity] = useState<Community | null>(null);
    const [editingTutorial, setEditingTutorial] = useState<Tutorial | null>(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Form Data
    const [communityForm, setCommunityForm] = useState({
        title: "",
        description: "",
        url: "",
        members: "",
        platform: "",
        icon_name: "MessageCircle",
        color_class: "bg-blue-500"
    });

    const [tutorialForm, setTutorialForm] = useState({
        title: "",
        description: "",
        url: "",
        duration: "",
        rating: 5.0,
        thumbnail: "🌱",
        platform: "YouTube"
    });

    useEffect(() => {
        if (isAuthenticated && isAdmin) {
            fetchData();
        }
    }, [isAuthenticated, isAdmin]);

    const fetchData = async () => {
        setLoading(true);
        await Promise.all([fetchCommunities(), fetchTutorials()]);
        setLoading(false);
    };

    const fetchCommunities = async () => {
        try {
            const { data, error } = await supabase.from('communities').select('*').order('id', { ascending: true });
            if (error) throw error;
            setCommunities(data || []);
        } catch (error) {
            console.error('Error fetching communities:', error);
        }
    };

    const fetchTutorials = async () => {
        try {
            const { data, error } = await supabase.from('tutorials').select('*').order('id', { ascending: true });
            if (error) throw error;
            setTutorials(data || []);
        } catch (error) {
            console.error('Error fetching tutorials:', error);
        }
    };

    // Community Handlers
    const handleCommunitySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            if (editingCommunity) {
                const { error } = await supabase.from('communities').update(communityForm).eq('id', editingCommunity.id);
                if (error) throw error;
                toast({ title: "Berhasil", description: "Komunitas berhasil diperbarui" });
            } else {
                const { error } = await supabase.from('communities').insert([communityForm]);
                if (error) throw error;
                toast({ title: "Berhasil", description: "Komunitas berhasil ditambahkan" });
            }
            setIsCommunityDialogOpen(false);
            resetCommunityForm();
            fetchCommunities();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDeleteCommunity = async (id: number) => {
        if (!confirm("Hapus komunitas ini?")) return;
        try {
            const { error } = await supabase.from('communities').delete().eq('id', id);
            if (error) throw error;
            fetchCommunities();
            toast({ title: "Berhasil", description: "Komunitas dihapus" });
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const resetCommunityForm = () => {
        setCommunityForm({
            title: "",
            description: "",
            url: "",
            members: "",
            platform: "",
            icon_name: "MessageCircle",
            color_class: "bg-blue-500"
        });
        setEditingCommunity(null);
    };

    const openEditCommunity = (c: Community) => {
        setEditingCommunity(c);
        setCommunityForm({
            title: c.title,
            description: c.description,
            url: c.url,
            members: c.members,
            platform: c.platform,
            icon_name: c.icon_name,
            color_class: c.color_class
        });
        setIsCommunityDialogOpen(true);
    };

    // Tutorial Handlers
    const handleTutorialSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            if (editingTutorial) {
                const { error } = await supabase.from('tutorials').update(tutorialForm).eq('id', editingTutorial.id);
                if (error) throw error;
                toast({ title: "Berhasil", description: "Tutorial berhasil diperbarui" });
            } else {
                const { error } = await supabase.from('tutorials').insert([tutorialForm]);
                if (error) throw error;
                toast({ title: "Berhasil", description: "Tutorial berhasil ditambahkan" });
            }
            setIsTutorialDialogOpen(false);
            resetTutorialForm();
            fetchTutorials();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDeleteTutorial = async (id: number) => {
        if (!confirm("Hapus tutorial ini?")) return;
        try {
            const { error } = await supabase.from('tutorials').delete().eq('id', id);
            if (error) throw error;
            fetchTutorials();
            toast({ title: "Berhasil", description: "Tutorial dihapus" });
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const resetTutorialForm = () => {
        setTutorialForm({
            title: "",
            description: "",
            url: "",
            duration: "",
            rating: 5.0,
            thumbnail: "🌱",
            platform: "YouTube"
        });
        setEditingTutorial(null);
    };

    const openEditTutorial = (t: Tutorial) => {
        setEditingTutorial(t);
        setTutorialForm({
            title: t.title,
            description: t.description,
            url: t.url,
            duration: t.duration,
            rating: t.rating,
            thumbnail: t.thumbnail,
            platform: t.platform
        });
        setIsTutorialDialogOpen(true);
    };

    if (!isAuthenticated || !isAdmin) {
        return <div className="p-8 text-center">Akses Ditolak</div>;
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold font-game">Admin Komunitas 👥</h1>
                        <p className="text-muted-foreground">Kelola link komunitas dan video tutorial</p>
                    </div>
                </div>

                <Tabs defaultValue="communities" className="space-y-6" onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="communities" className="flex gap-2"><Users className="h-4 w-4" /> Komunitas</TabsTrigger>
                        <TabsTrigger value="tutorials" className="flex gap-2"><BookOpen className="h-4 w-4" /> Tutorial</TabsTrigger>
                    </TabsList>

                    {/* Communities Tab */}
                    <TabsContent value="communities" className="space-y-4">
                        <div className="flex justify-end">
                            <Dialog open={isCommunityDialogOpen} onOpenChange={(open) => { setIsCommunityDialogOpen(open); if (!open) resetCommunityForm(); }}>
                                <DialogTrigger asChild>
                                    <Button className="hover-bounce"><Plus className="mr-2 h-4 w-4" /> Tambah Komunitas</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader><DialogTitle>{editingCommunity ? 'Edit Komunitas' : 'Tambah Komunitas'}</DialogTitle></DialogHeader>
                                    <form onSubmit={handleCommunitySubmit} className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label>Judul</Label>
                                            <Input value={communityForm.title} onChange={e => setCommunityForm({ ...communityForm, title: e.target.value })} required />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Deskripsi</Label>
                                            <Textarea value={communityForm.description} onChange={e => setCommunityForm({ ...communityForm, description: e.target.value })} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label>URL</Label>
                                                <Input value={communityForm.url} onChange={e => setCommunityForm({ ...communityForm, url: e.target.value })} required />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Jumlah Member</Label>
                                                <Input value={communityForm.members} onChange={e => setCommunityForm({ ...communityForm, members: e.target.value })} placeholder="10K+" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label>Platform</Label>
                                                <Input value={communityForm.platform} onChange={e => setCommunityForm({ ...communityForm, platform: e.target.value })} placeholder="Facebook" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Icon (Lucide Name)</Label>
                                                <Input value={communityForm.icon_name} onChange={e => setCommunityForm({ ...communityForm, icon_name: e.target.value })} placeholder="MessageCircle" />
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Warna (Tailwind Class)</Label>
                                            <Input value={communityForm.color_class} onChange={e => setCommunityForm({ ...communityForm, color_class: e.target.value })} placeholder="bg-blue-500" />
                                        </div>
                                        <Button type="submit" disabled={submitLoading} className="w-full">
                                            {submitLoading ? <Loader2 className="animate-spin" /> : "Simpan"}
                                        </Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {communities.map(item => (
                                <Card key={item.id} className="relative group">
                                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button size="icon" variant="secondary" onClick={() => openEditCommunity(item)}><Edit className="h-4 w-4" /></Button>
                                        <Button size="icon" variant="destructive" onClick={() => handleDeleteCommunity(item.id)}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="text-lg">{item.title}</CardTitle>
                                        <Badge variant="secondary">{item.platform}</Badge>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                                        <p className="mt-2 text-xs font-bold">{item.members} Member</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Tutorials Tab */}
                    <TabsContent value="tutorials" className="space-y-4">
                        <div className="flex justify-end">
                            <Dialog open={isTutorialDialogOpen} onOpenChange={(open) => { setIsTutorialDialogOpen(open); if (!open) resetTutorialForm(); }}>
                                <DialogTrigger asChild>
                                    <Button className="hover-bounce"><Plus className="mr-2 h-4 w-4" /> Tambah Tutorial</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader><DialogTitle>{editingTutorial ? 'Edit Tutorial' : 'Tambah Tutorial'}</DialogTitle></DialogHeader>
                                    <form onSubmit={handleTutorialSubmit} className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label>Judul</Label>
                                            <Input value={tutorialForm.title} onChange={e => setTutorialForm({ ...tutorialForm, title: e.target.value })} required />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Deskripsi</Label>
                                            <Textarea value={tutorialForm.description} onChange={e => setTutorialForm({ ...tutorialForm, description: e.target.value })} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label>URL</Label>
                                                <Input value={tutorialForm.url} onChange={e => setTutorialForm({ ...tutorialForm, url: e.target.value })} required />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Durasi</Label>
                                                <Input value={tutorialForm.duration} onChange={e => setTutorialForm({ ...tutorialForm, duration: e.target.value })} placeholder="15 menit" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label>Rating (0-5)</Label>
                                                <Input type="number" step="0.1" min="0" max="5" value={tutorialForm.rating} onChange={e => setTutorialForm({ ...tutorialForm, rating: parseFloat(e.target.value) })} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Thumbnail (Emoji)</Label>
                                                <Input value={tutorialForm.thumbnail} onChange={e => setTutorialForm({ ...tutorialForm, thumbnail: e.target.value })} placeholder="🌱" />
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Platform</Label>
                                            <Input value={tutorialForm.platform} onChange={e => setTutorialForm({ ...tutorialForm, platform: e.target.value })} placeholder="YouTube" />
                                        </div>
                                        <Button type="submit" disabled={submitLoading} className="w-full">
                                            {submitLoading ? <Loader2 className="animate-spin" /> : "Simpan"}
                                        </Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tutorials.map(item => (
                                <Card key={item.id} className="relative group">
                                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button size="icon" variant="secondary" onClick={() => openEditTutorial(item)}><Edit className="h-4 w-4" /></Button>
                                        <Button size="icon" variant="destructive" onClick={() => handleDeleteTutorial(item.id)}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div className="text-4xl mr-4">{item.thumbnail}</div>
                                            <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                                        <div className="flex items-center gap-2 mt-2 text-xs font-semibold">
                                            <span>{item.platform}</span> • <span>{item.duration}</span> • <span>⭐ {item.rating}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                </Tabs>
            </div>
        </div>
    );
};

export default AdminCommunity;
