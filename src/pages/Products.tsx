import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import { ExternalLink, Search, Star, ShoppingBag } from "lucide-react";
import { apiFetch, getAssetUrl } from "@/lib/api";

interface ProductRecommendation {
  id: string;
  category: string;
  product_name: string;
  description?: string;
  price_range?: string;
  product_link?: string;
  image_url?: string;
  rating?: number;
}

const Products = () => {
  const [products, setProducts] = useState<ProductRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await apiFetch<ProductRecommendation[]>("/products");
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["Semua", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "Semua" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="text-sm text-muted-foreground ml-1">({rating})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Memuat rekomendasi produk...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-game font-bold text-foreground mb-4">
            🛍️ Rekomendasi Produk Berkebun
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-fun">
            Temukan alat, pupuk, dan media tanam terbaik untuk tanaman cantik Anda! 🌱✨
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 max-w-md mx-auto"
          />
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:inline-flex">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-game font-bold text-foreground">
                    🔍 Produk tidak ditemukan
                  </h3>
                  <p className="text-muted-foreground font-fun">
                    Coba ubah kata kunci pencarian atau kategori 🕵️‍♂️
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                {product.image_url && (
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={getAssetUrl(product.image_url)}
                      alt={product.product_name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="mb-2">
                      {product.category}
                    </Badge>
                    {product.rating && renderStars(product.rating)}
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {product.product_name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {product.description && (
                    <p className="text-muted-foreground text-sm">
                      {product.description}
                    </p>
                  )}

                  {product.price_range && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Harga</span>
                      <span className="font-semibold text-primary">
                        {product.price_range}
                      </span>
                    </div>
                  )}

                  {product.product_link && (
                    <Button
                      variant="fun"
                      className="w-full hover-bounce"
                      onClick={() => window.open(product.product_link, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      🛒 Lihat Produk
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-game font-bold text-foreground">
              💡 Tips Memilih Produk Berkebun
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h3 className="font-semibold">Sesuaikan dengan Tanaman</h3>
                <p className="text-sm text-muted-foreground">
                  Pilih produk yang sesuai dengan jenis dan kebutuhan tanaman Anda
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-accent font-bold">2</span>
                </div>
                <h3 className="font-semibold">Perhatikan Kualitas</h3>
                <p className="text-sm text-muted-foreground">
                  Baca review dan rating produk sebelum membeli
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary-glow/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary-glow font-bold">3</span>
                </div>
                <h3 className="font-semibold">Budget yang Sesuai</h3>
                <p className="text-sm text-muted-foreground">
                  Pilih produk dengan kualitas baik sesuai anggaran Anda
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
