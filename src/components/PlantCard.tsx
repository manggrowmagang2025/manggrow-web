import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Droplets, 
  Leaf, 
  MoreVertical, 
  Calendar,
  Edit,
  Trash2,
  Camera
} from "lucide-react";

interface Plant {
  id: number;
  name: string;
  type: string;
  watering_frequency: number;
  fertilizer_frequency: number;
  photo_url?: string;
  notes?: string;
  last_watered?: string;
  last_fertilized?: string;
}

interface PlantCardProps {
  plant: Plant;
  onEdit: (plant: Plant) => void;
  onDelete: (id: number) => void;
  onWater: (id: number) => void;
  onFertilize: (id: number) => void;
}

const PlantCard = ({ plant, onEdit, onDelete, onWater, onFertilize }: PlantCardProps) => {
  const [imageError, setImageError] = useState(false);

  const getDaysUntilNextWatering = () => {
    if (!plant.last_watered) return 0;
    const lastWatered = new Date(plant.last_watered);
    const nextWatering = new Date(lastWatered.getTime() + plant.watering_frequency * 24 * 60 * 60 * 1000);
    const now = new Date();
    const diffTime = nextWatering.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysUntilNextFertilizing = () => {
    if (!plant.last_fertilized) return 0;
    const lastFertilized = new Date(plant.last_fertilized);
    const nextFertilizing = new Date(lastFertilized.getTime() + plant.fertilizer_frequency * 24 * 60 * 60 * 1000);
    const now = new Date();
    const diffTime = nextFertilizing.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilWater = getDaysUntilNextWatering();
  const daysUntilFertilizer = getDaysUntilNextFertilizing();

  const getWateringStatus = () => {
    if (daysUntilWater <= 0) return { text: "Perlu disiram!", variant: "destructive" as const };
    if (daysUntilWater <= 2) return { text: `${daysUntilWater} hari lagi`, variant: "warning" as const };
    return { text: `${daysUntilWater} hari lagi`, variant: "secondary" as const };
  };

  const getFertilizerStatus = () => {
    if (daysUntilFertilizer <= 0) return { text: "Perlu pupuk!", variant: "destructive" as const };
    if (daysUntilFertilizer <= 7) return { text: `${daysUntilFertilizer} hari lagi`, variant: "warning" as const };
    return { text: `${daysUntilFertilizer} hari lagi`, variant: "secondary" as const };
  };

  const wateringStatus = getWateringStatus();
  const fertilizerStatus = getFertilizerStatus();

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-border/50">
      <div className="relative">
        {plant.photo_url && !imageError ? (
          <img
            src={plant.photo_url}
            alt={plant.name}
            className="w-full h-48 object-cover rounded-t-lg"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary-glow/20 rounded-t-lg flex items-center justify-center">
            <Camera className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white/90"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(plant)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(plant.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-foreground">{plant.name}</h3>
            <p className="text-sm text-muted-foreground">{plant.type}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Penyiraman</span>
              </div>
              <Badge variant={wateringStatus.variant}>
                {wateringStatus.text}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Leaf className="h-4 w-4 text-accent" />
                <span className="text-sm">Pemupukan</span>
              </div>
              <Badge variant={fertilizerStatus.variant}>
                {fertilizerStatus.text}
              </Badge>
            </div>
          </div>

          {plant.notes && (
            <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
              {plant.notes}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onWater(plant.id)}
          className="flex-1"
        >
          <Droplets className="h-4 w-4 mr-1" />
          Siram
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onFertilize(plant.id)}
          className="flex-1"
        >
          <Leaf className="h-4 w-4 mr-1" />
          Pupuk
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlantCard;
