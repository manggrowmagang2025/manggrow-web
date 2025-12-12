import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit, Image as ImageIcon, Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";

interface Product {
    id: number;
    product_name: string;
    category: string;
    description: string;
    price_range: string;
    product_link: string;
    image_url: string;
}

const AdminProducts = () => {
    const { user, isAdmin } = useAuth();
    const isAuthenticated = !!user;
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [formData, setFormData] = useState({
        product_name: "",
        category: "",
        description: "",
        price_range: "",
        product_link: "",
        image_url: ""
    });

    useEffect(() => {
        if (isAuthenticated && isAdmin) {
            fetchProducts();
        }
    }, [isAuthenticated, isAdmin]);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast({
                title: "Error",
                description: "Gagal mengambil data produk",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const resetForm = () => {
        setFormData({
            product_name: "",
            category: "",
            description: "",
            price_range: "",
            product_link: "",
            image_url: ""
        });
        setSelectedFile(null);
        setEditingProduct(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            let finalImageUrl = formData.image_url;

            if (selectedFile) {
                const fileExt = selectedFile.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `products/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('products')
                    .upload(filePath, selectedFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(filePath);
                finalImageUrl = publicUrl;
            }

            const payload = {
                ...formData,
                image_url: finalImageUrl
            };

            if (editingProduct) {
                const { error } = await supabase
                    .from('products')
                    .update(payload)
                    .eq('id', editingProduct.id);
                if (error) throw error;
                toast({ title: "Berhasil", description: "Produk berhasil diperbarui" });
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([payload]);
                if (error) throw error;
                toast({ title: "Berhasil", description: "Produk berhasil ditambahkan" });
            }

            setIsDialogOpen(false);
            resetForm();
            fetchProducts();
        } catch (error: any) {
            console.error('Error saving product:', error);
            toast({
                title: "Error",
                description: error.message || "Gagal menyimpan produk",
                variant: "destructive"
            });
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;

        try {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
            toast({ title: "Berhasil", description: "Produk berhasil dihapus" });
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            toast({
                title: "Error",
                description: "Gagal menghapus produk",
                variant: "destructive"
            });
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            product_name: product.product_name,
            category: product.category,
            description: product.description || "",
            price_range: product.price_range || "",
            product_link: product.product_link || "",
            image_url: product.image_url || ""
        });
        setIsDialogOpen(true);
    };

    if (!isAuthenticated || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Akses Ditolak</h1>
                    <p className="text-muted-foreground">Hanya admin yang dapat mengakses halaman ini.</p>
                    <Button className="mt-4" onClick={() => window.location.href = '/'}>Kembali ke Beranda</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold font-game">Dashboard Admin 🛠️</h1>
                        <p className="text-muted-foreground">Kelola rekomendasi produk untuk member</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) resetForm();
                    }}>
                        <DialogTrigger asChild>
                            <Button className="font-fun hover-bounce">
                                <Plus className="h-4 w-4 mr-2" />
                                Tambah Produk
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Nama Produk</Label>
                                    <Input
                                        value={formData.product_name}
                                        onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Kategori</Label>
                                    <Input
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        placeholder="Contoh: Pupuk, Alat Siram, Media Tanam"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Deskripsi</Label>
                                    <Textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Harga / Range Harga</Label>
                                        <Input
                                            value={formData.price_range}
                                            onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                                            placeholder="Rp 50.000 - Rp 100.000"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Link Produk</Label>
                                        <Input
                                            value={formData.product_link}
                                            onChange={(e) => setFormData({ ...formData, product_link: e.target.value })}
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Foto Produk</Label>
                                    <div className="flex items-center gap-4">
                                        {formData.image_url && !selectedFile && (
                                            <img
                                                src={formData.image_url}
                                                alt="Preview"
                                                className="h-16 w-16 object-cover rounded-md border"
                                            />
                                        )}
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" disabled={submitLoading}>
                                    {submitLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        'Simpan Produk'
                                    )}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <Card key={product.id} className="group hover:shadow-lg transition-all">
                                <div className="relative h-48 overflow-hidden rounded-t-lg bg-muted">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.product_name}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-muted-foreground">
                                            <ImageIcon className="h-12 w-12" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button size="icon" variant="secondary" onClick={() => handleEdit(product)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="destructive" onClick={() => handleDelete(product.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-lg">{product.product_name}</CardTitle>
                                    <p className="text-sm text-muted-foreground">{product.category}</p>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm line-clamp-2">{product.description}</p>
                                    <p className="mt-2 font-semibold text-primary">{product.price_range}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProducts;
