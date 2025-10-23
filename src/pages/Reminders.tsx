import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { 
  Calendar, 
  Droplets, 
  Leaf, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Plus
} from "lucide-react";

interface Plant {
  id: string;
  name: string;
  type: string;
  watering_frequency: number;
  fertilizer_frequency: number;
  last_watered?: string;
  last_fertilized?: string;
}

interface Reminder {
  id: string;
  plant_id: string;
  care_type: 'watering' | 'fertilizing' | 'pruning' | 'repotting';
  scheduled_date: string;
  is_completed: boolean;
  completed_date?: string;
  plant?: Plant;
}

const Reminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch plants
      const { data: plantsData, error: plantsError } = await supabase
        .from('plants')
        .select('*');

      if (plantsError) throw plantsError;
      setPlants(plantsData || []);

      // Generate reminders based on plant schedules
      await generateReminders(plantsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data reminder",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateReminders = async (plantsData: Plant[]) => {
    const today = new Date();
    const generatedReminders: Omit<Reminder, 'id'>[] = [];

    plantsData.forEach(plant => {
      // Generate watering reminders
      if (plant.last_watered) {
        const lastWatered = new Date(plant.last_watered);
        const nextWatering = new Date(lastWatered.getTime() + plant.watering_frequency * 24 * 60 * 60 * 1000);
        
        if (nextWatering <= today) {
          generatedReminders.push({
            plant_id: plant.id,
            care_type: 'watering',
            scheduled_date: nextWatering.toISOString().split('T')[0],
            is_completed: false,
            plant
          });
        }
      } else {
        // If never watered, schedule for today
        generatedReminders.push({
          plant_id: plant.id,
          care_type: 'watering',
          scheduled_date: today.toISOString().split('T')[0],
          is_completed: false,
          plant
        });
      }

      // Generate fertilizing reminders
      if (plant.last_fertilized) {
        const lastFertilized = new Date(plant.last_fertilized);
        const nextFertilizing = new Date(lastFertilized.getTime() + plant.fertilizer_frequency * 24 * 60 * 60 * 1000);
        
        if (nextFertilizing <= today) {
          generatedReminders.push({
            plant_id: plant.id,
            care_type: 'fertilizing',
            scheduled_date: nextFertilizing.toISOString().split('T')[0],
            is_completed: false,
            plant
          });
        }
      } else {
        // If never fertilized, schedule for a week from now
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        generatedReminders.push({
          plant_id: plant.id,
          care_type: 'fertilizing',
          scheduled_date: nextWeek.toISOString().split('T')[0],
          is_completed: false,
          plant
        });
      }
    });

    setReminders(generatedReminders as Reminder[]);
  };

  const markAsCompleted = async (plant: Plant, careType: 'watering' | 'fertilizing') => {
    try {
      const updateData: any = {};
      
      if (careType === 'watering') {
        updateData.last_watered = new Date().toISOString().split('T')[0];
      } else if (careType === 'fertilizing') {
        updateData.last_fertilized = new Date().toISOString().split('T')[0];
      }

      const { error } = await supabase
        .from('plants')
        .update(updateData)
        .eq('id', plant.id);

      if (error) throw error;

      await fetchData();
      
      toast({
        title: "Berhasil!",
        description: `${careType === 'watering' ? 'Penyiraman' : 'Pemupukan'} telah dicatat`
      });
    } catch (error) {
      console.error('Error completing reminder:', error);
      toast({
        title: "Error",
        description: "Gagal menandai reminder sebagai selesai",
        variant: "destructive"
      });
    }
  };

  const getCareTypeIcon = (careType: string) => {
    switch (careType) {
      case 'watering':
        return <Droplets className="h-4 w-4" />;
      case 'fertilizing':
        return <Leaf className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getCareTypeLabel = (careType: string) => {
    switch (careType) {
      case 'watering':
        return 'Penyiraman';
      case 'fertilizing':
        return 'Pemupukan';
      default:
        return careType;
    }
  };

  const getCareTypeColor = (careType: string) => {
    switch (careType) {
      case 'watering':
        return 'text-blue-600 bg-blue-100';
      case 'fertilizing':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getOverdueReminders = () => {
    const today = new Date();
    return reminders.filter(reminder => {
      const scheduledDate = new Date(reminder.scheduled_date);
      return scheduledDate < today && !reminder.is_completed;
    });
  };

  const getTodayReminders = () => {
    const today = new Date().toISOString().split('T')[0];
    return reminders.filter(reminder => 
      reminder.scheduled_date === today && !reminder.is_completed
    );
  };

  const getUpcomingReminders = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return reminders.filter(reminder => {
      const scheduledDate = new Date(reminder.scheduled_date);
      return scheduledDate > today && scheduledDate <= nextWeek && !reminder.is_completed;
    });
  };

  const overdueReminders = getOverdueReminders();
  const todayReminders = getTodayReminders();
  const upcomingReminders = getUpcomingReminders();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Memuat reminder...</p>
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-game font-bold text-foreground">⏰ Pengingat Perawatan</h1>
            <p className="text-muted-foreground font-fun text-lg">
              Jangan lewatkan jadwal perawatan tanaman cantik Anda! 🌱💚
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-destructive/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Terlambat</p>
                  <p className="text-2xl font-bold text-destructive">{overdueReminders.length}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-warning/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Hari Ini</p>
                  <p className="text-2xl font-bold text-warning">{todayReminders.length}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Minggu Ini</p>
                  <p className="text-2xl font-bold text-primary">{upcomingReminders.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reminders Tabs */}
        <Tabs defaultValue="overdue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overdue" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Terlambat ({overdueReminders.length})
            </TabsTrigger>
            <TabsTrigger value="today" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Hari Ini ({todayReminders.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Mendatang ({upcomingReminders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overdue" className="space-y-4">
            {overdueReminders.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <CheckCircle2 className="h-12 w-12 text-success mb-4" />
                  <h3 className="text-xl font-game font-bold text-foreground">🎉 Tidak ada yang terlambat!</h3>
                  <p className="text-muted-foreground font-fun">Semua tanaman Anda dalam jadwal yang baik! 🌱✨</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {overdueReminders.map((reminder, index) => (
                  <Card key={index} className="border-destructive/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${getCareTypeColor(reminder.care_type)}`}>
                            {getCareTypeIcon(reminder.care_type)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {reminder.plant?.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {getCareTypeLabel(reminder.care_type)} • Terlambat {Math.floor((new Date().getTime() - new Date(reminder.scheduled_date).getTime()) / (1000 * 60 * 60 * 24))} hari
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="success"
                          size="sm"
                          className="hover-bounce"
                          onClick={() => reminder.plant && (reminder.care_type === 'watering' || reminder.care_type === 'fertilizing') && markAsCompleted(reminder.plant, reminder.care_type)}
                          disabled={reminder.care_type !== 'watering' && reminder.care_type !== 'fertilizing'}
                        >
                          ✅ Tandai Selesai
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="today" className="space-y-4">
            {todayReminders.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <CheckCircle2 className="h-12 w-12 text-success mb-4" />
                  <h3 className="text-xl font-game font-bold text-foreground">🎉 Tidak ada tugas hari ini!</h3>
                  <p className="text-muted-foreground font-fun">Nikmati hari yang santai! ☀️🌸</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {todayReminders.map((reminder, index) => (
                  <Card key={index} className="border-warning/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${getCareTypeColor(reminder.care_type)}`}>
                            {getCareTypeIcon(reminder.care_type)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {reminder.plant?.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {getCareTypeLabel(reminder.care_type)} • Hari ini
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="success"
                          size="sm"
                          className="hover-bounce"
                          onClick={() => reminder.plant && (reminder.care_type === 'watering' || reminder.care_type === 'fertilizing') && markAsCompleted(reminder.plant, reminder.care_type)}
                          disabled={reminder.care_type !== 'watering' && reminder.care_type !== 'fertilizing'}
                        >
                          ✅ Tandai Selesai
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingReminders.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-game font-bold text-foreground">📅 Tidak ada jadwal mendatang</h3>
                  <p className="text-muted-foreground font-fun">Semua tanaman dalam kondisi baik! 🌿💚</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingReminders.map((reminder, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${getCareTypeColor(reminder.care_type)}`}>
                            {getCareTypeIcon(reminder.care_type)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {reminder.plant?.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {getCareTypeLabel(reminder.care_type)} • {new Date(reminder.scheduled_date).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {Math.ceil((new Date(reminder.scheduled_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} hari lagi
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Empty State */}
        {plants.length === 0 && (
          <Card className="mt-8">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Plus className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-game font-bold text-foreground">🌱 Belum ada tanaman</h3>
              <p className="text-muted-foreground mb-4 font-fun">Tambahkan tanaman pertama Anda untuk mulai mendapatkan reminder perawatan! 🌿✨</p>
              <Button variant="fun" size="lg" className="hover-bounce" onClick={() => window.location.href = '/my-plants'}>
                🚀 Tambah Tanaman
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Reminders;