
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    PieChart, Pie, Cell,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line
} from 'recharts';
import { Loader2, TrendingUp, Users, Leaf, ShoppingBag, BookOpen } from "lucide-react";

// COLORS for Recharts
const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const AdminDashboard = () => {
    const { user, isAdmin } = useAuth();
    const isAuthenticated = !!user;
    const [loading, setLoading] = useState(true);

    // Stats State
    const [stats, setStats] = useState({
        totalPlants: 0,
        activeUsers: 0,
        totalProducts: 0,
        totalCommunities: 0,
        totalTutorials: 0
    });

    // Chart Data State
    const [plantTypeData, setPlantTypeData] = useState<any[]>([]);
    const [communityPlatformData, setCommunityPlatformData] = useState<any[]>([]);
    const [tutorialRatingData, setTutorialRatingData] = useState<any[]>([]);

    useEffect(() => {
        if (isAuthenticated && isAdmin) {
            fetchDashboardData();
        }
    }, [isAuthenticated, isAdmin]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Plants Data for Pie Chart & User Count
            const { data: plantsData } = await supabase.from('plants').select('id, type, user_id, created_at');

            // Process Plants Data
            if (plantsData) {
                // Total Plants
                const totalPlants = plantsData.length;

                // Active Users (Unique user_ids)
                const uniqueUsers = new Set(plantsData.map(p => p.user_id)).size;

                // Group by Type for Pie Chart
                const typeCounts: { [key: string]: number } = {};
                plantsData.forEach(p => {
                    // Capitalize first letter
                    const type = p.type ? (p.type.charAt(0).toUpperCase() + p.type.slice(1).toLowerCase()) : 'Lainnya';
                    typeCounts[type] = (typeCounts[type] || 0) + 1;
                });

                const pieData = Object.keys(typeCounts).map(key => ({
                    name: key,
                    value: typeCounts[key]
                })).sort((a, b) => b.value - a.value).slice(0, 6); // Top 6 types

                setPlantTypeData(pieData);
                setStats(prev => ({ ...prev, totalPlants, activeUsers: uniqueUsers }));
            }

            // 2. Fetch Commercial & Content Data
            const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
            const { data: communities } = await supabase.from('communities').select('platform');
            const { data: tutorials } = await supabase.from('tutorials').select('rating');

            // Update basic counts
            setStats(prev => ({
                ...prev,
                totalProducts: productCount || 0,
                totalCommunities: communities?.length || 0,
                totalTutorials: tutorials?.length || 0
            }));

            // Process Community Data (Platform Distribution)
            if (communities) {
                const platformCounts: { [key: string]: number } = {};
                communities.forEach(c => {
                    const platform = c.platform || 'Unknown';
                    platformCounts[platform] = (platformCounts[platform] || 0) + 1;
                });
                const barData = Object.keys(platformCounts).map(key => ({
                    platform: key,
                    count: platformCounts[key]
                }));
                setCommunityPlatformData(barData);
            }

            // Process Tutorial Data (Rating Distribution) - Simple histogram simulation
            if (tutorials) {
                const ratingRanges = [
                    { name: '5 ⭐', min: 4.8 },
                    { name: '4-4.8 ⭐', min: 4.0 },
                    { name: '3-4 ⭐', min: 3.0 },
                    { name: '< 3 ⭐', min: 0 }
                ];

                const ratingData = ratingRanges.map(range => {
                    const count = tutorials.filter(t =>
                        (t.rating >= range.min) &&
                        (range.name === '5 ⭐' ? true : t.rating < (range.name === '< 3 ⭐' ? 3.0 : (range.name === '4-4.8 ⭐' ? 4.8 : 4.0)))
                    ).length;
                    return { name: range.name, count };
                });
                setTutorialRatingData(ratingData);
            }

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated || !isAdmin) {
        return <div className="p-8 text-center">Akses Ditolak</div>;
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-game">Dashboard Analitik 📊</h1>
                    <p className="text-muted-foreground">Ringkasan statistik pertumbuhan Manggrow</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : (
                    <div className="space-y-8">
                        {/* 1. Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="hover:shadow-md transition-all">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Tanaman</CardTitle>
                                    <Leaf className="h-4 w-4 text-green-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.totalPlants}</div>
                                    <p className="text-xs text-muted-foreground">+ dari {stats.activeUsers} pengguna aktif</p>
                                </CardContent>
                            </Card>
                            <Card className="hover:shadow-md transition-all">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Produk Rekomendasi</CardTitle>
                                    <ShoppingBag className="h-4 w-4 text-blue-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.totalProducts}</div>
                                    <p className="text-xs text-muted-foreground">Item tersedia</p>
                                </CardContent>
                            </Card>
                            <Card className="hover:shadow-md transition-all">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Komunitas</CardTitle>
                                    <Users className="h-4 w-4 text-orange-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.totalCommunities}</div>
                                    <p className="text-xs text-muted-foreground">Platform terhubung</p>
                                </CardContent>
                            </Card>
                            <Card className="hover:shadow-md transition-all">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Konten Edukasi</CardTitle>
                                    <BookOpen className="h-4 w-4 text-purple-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.totalTutorials}</div>
                                    <p className="text-xs text-muted-foreground">Video tutorial</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* 2. Charts Section */}
                        <div className="grid lg:grid-cols-2 gap-8">

                            {/* Plant Types Pie Chart */}
                            <Card className="col-span-1">
                                <CardHeader>
                                    <CardTitle>Distribusi Jenis Tanaman</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={plantTypeData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {plantTypeData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Community Platforms Bar Chart */}
                            <Card className="col-span-1">
                                <CardHeader>
                                    <CardTitle>Platform Komunitas Terpopuler</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={communityPlatformData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="platform" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Jumlah Komunitas" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Tutorial Ratings Bar Chart */}
                            <Card className="col-span-1 lg:col-span-2">
                                <CardHeader>
                                    <CardTitle>Kualitas Konten Tutorial (Rating)</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={tutorialRatingData} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis dataKey="name" type="category" width={100} />
                                            <Tooltip />
                                            <Bar dataKey="count" fill="#10B981" radius={[0, 4, 4, 0]} name="Jumlah Video" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
