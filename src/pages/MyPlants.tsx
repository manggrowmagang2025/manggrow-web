import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import PlantCard from "@/components/PlantCard";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Search } from "lucide-react";

interface Plant {
  id: string;
  name: string;
  type: string;
  watering_frequency: number;
  fertilizer_frequency: number;
  photo_url?: string;
  notes?: string;
  last_watered?: string;
  last_fertilized?: string;
}

const MyPlants = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    watering_frequency: 7,
    fertilizer_frequency: 30,
    photo_url: "",
    notes: ""
  });

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const { data, error } = await supabase
        .from('plants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlants(data || []);
    } catch (error) {
      console.error('Error fetching plants:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data tanaman",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPlant) {
        // Update existing plant
        const { error } = await supabase
          .from('plants')
          .update({
            name: formData.name,
            type: formData.type,
            watering_frequency: formData.watering_frequency,
            fertilizer_frequency: formData.fertilizer_frequency,
            photo_url: formData.photo_url || null,
            notes: formData.notes || null
          })
          .eq('id', editingPlant.id);

        if (error) throw error;
        
        toast({
          title: "Berhasil!",
          description: "Data tanaman berhasil diperbarui"
        });
      } else {
        // Create new plant
        const { error } = await supabase
          .from('plants')
          .insert([{
            name: formData.name,
            type: formData.type,
            watering_frequency: formData.watering_frequency,
            fertilizer_frequency: formData.fertilizer_frequency,
            photo_url: formData.photo_url || null,
            notes: formData.notes || null,
            user_id: (await supabase.auth.getUser()).data.user?.id
          }]);

        if (error) throw error;
        
        toast({
          title: "Berhasil!",
          description: "Tanaman baru berhasil ditambahkan"
        });
      }

      await fetchPlants();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving plant:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan data tanaman",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      watering_frequency: 7,
      fertilizer_frequency: 30,
      photo_url: "",
      notes: ""
    });
    setEditingPlant(null);
  };

  const handleEdit = (plant: Plant) => {
    setEditingPlant(plant);
    setFormData({
      name: plant.name,
      type: plant.type,
      watering_frequency: plant.watering_frequency,
      fertilizer_frequency: plant.fertilizer_frequency,
      photo_url: plant.photo_url || "",
      notes: plant.notes || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus tanaman ini?")) return;
    
    try {
      const { error } = await supabase
        .from('plants')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchPlants();
      toast({
        title: "Berhasil!",
        description: "Tanaman berhasil dihapus"
      });
    } catch (error) {
      console.error('Error deleting plant:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus tanaman",
        variant: "destructive"
      });
    }
  };

  const handleWater = async (id: string) => {
    try {
      const { error } = await supabase
        .from('plants')
        .update({ last_watered: new Date().toISOString().split('T')[0] })
        .eq('id', id);

      if (error) throw error;
      
      await fetchPlants();
      toast({
        title: "Berhasil!",
        description: "Tanaman telah disiram"
      });
    } catch (error) {
      console.error('Error watering plant:', error);
      toast({
        title: "Error",
        description: "Gagal mencatat penyiraman",
        variant: "destructive"
      });
    }
  };

  const handleFertilize = async (id: string) => {
    try {
      const { error } = await supabase
        .from('plants')
        .update({ last_fertilized: new Date().toISOString().split('T')[0] })
        .eq('id', id);

      if (error) throw error;
      
      await fetchPlants();
      toast({
        title: "Berhasil!",
        description: "Tanaman telah dipupuk"
      });
    } catch (error) {
      console.error('Error fertilizing plant:', error);
      toast({
        title: "Error",
        description: "Gagal mencatat pemupukan",
        variant: "destructive"
      });
    }
  };

  const filteredPlants = plants.filter(plant =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plant.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Memuat data tanaman...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-game font-bold text-foreground">🌱 Kebun Saya</h1>
            <p className="text-muted-foreground font-fun text-lg">
              Kelola dan pantau semua tanaman cantik Anda 🌿✨
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="playful" size="lg" onClick={() => { resetForm(); setIsDialogOpen(true); }} className="hover-bounce">
                <Plus className="h-5 w-5 mr-2" />
                🌱 Tambah Tanaman Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingPlant ? "Edit Tanaman" : "Tambah Tanaman Baru"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nama Tanaman *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Monstera Deliciosa"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Jenis Tanaman *</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="Contoh: Tanaman Hias"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="watering">Siram Setiap (hari)</Label>
                    <Input
                      id="watering"
                      type="number"
                      min="1"
                      value={formData.watering_frequency}
                      onChange={(e) => setFormData({ ...formData, watering_frequency: parseInt(e.target.value) })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="fertilizing">Pupuk Setiap (hari)</Label>
                    <Input
                      id="fertilizing"
                      type="number"
                      min="1"
                      value={formData.fertilizer_frequency}
                      onChange={(e) => setFormData({ ...formData, fertilizer_frequency: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="photo">URL Foto (opsional)</Label>
                  <Input
                    id="photo"
                    value={formData.photo_url}
                    onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
                
                <div>
                  <Label htmlFor="notes">Catatan (opsional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Catatan khusus untuk tanaman ini..."
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingPlant ? "Update" : "Tambah"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Cari tanaman..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Plants Grid */}
        {filteredPlants.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-game font-bold text-foreground">
                    {searchTerm ? "🔍 Tanaman tidak ditemukan" : "🌱 Belum ada tanaman"}
                  </h3>
                  <p className="text-muted-foreground font-fun">
                    {searchTerm 
                      ? "Coba ubah kata kunci pencarian Anda 🕵️‍♂️"
                      : "Tambahkan tanaman pertama Anda untuk memulai petualangan berkebun! 🌿✨"
                    }
                  </p>
                </div>
                {!searchTerm && (
                  <Button variant="fun" size="lg" onClick={() => setIsDialogOpen(true)} className="hover-bounce">
                    <Plus className="h-5 w-5 mr-2" />
                    🌱 Mulai Berkebun!
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlants.map((plant) => (
              <PlantCard
                key={plant.id}
                plant={plant}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onWater={handleWater}
                onFertilize={handleFertilize}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPlants;