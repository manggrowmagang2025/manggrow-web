-- Create plants table
CREATE TABLE public.plants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  watering_frequency INTEGER NOT NULL DEFAULT 7, -- days
  fertilizer_frequency INTEGER NOT NULL DEFAULT 30, -- days
  photo_url TEXT,
  notes TEXT,
  last_watered DATE,
  last_fertilized DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create care_reminders table
CREATE TABLE public.care_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plant_id UUID NOT NULL REFERENCES public.plants(id) ON DELETE CASCADE,
  care_type TEXT NOT NULL CHECK (care_type IN ('watering', 'fertilizing', 'pruning', 'repotting')),
  scheduled_date DATE NOT NULL,
  completed_date DATE,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create product_recommendations table
CREATE TABLE public.product_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  product_name TEXT NOT NULL,
  description TEXT,
  price_range TEXT,
  product_link TEXT,
  image_url TEXT,
  rating DECIMAL(2,1),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies for plants table
CREATE POLICY "Users can view their own plants" 
ON public.plants 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own plants" 
ON public.plants 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plants" 
ON public.plants 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plants" 
ON public.plants 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for care_reminders table
CREATE POLICY "Users can view reminders for their plants" 
ON public.care_reminders 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.plants 
  WHERE plants.id = care_reminders.plant_id 
  AND plants.user_id = auth.uid()
));

CREATE POLICY "Users can create reminders for their plants" 
ON public.care_reminders 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.plants 
  WHERE plants.id = care_reminders.plant_id 
  AND plants.user_id = auth.uid()
));

CREATE POLICY "Users can update reminders for their plants" 
ON public.care_reminders 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.plants 
  WHERE plants.id = care_reminders.plant_id 
  AND plants.user_id = auth.uid()
));

CREATE POLICY "Users can delete reminders for their plants" 
ON public.care_reminders 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.plants 
  WHERE plants.id = care_reminders.plant_id 
  AND plants.user_id = auth.uid()
));

-- Create policies for product_recommendations (public read access)
CREATE POLICY "Everyone can view product recommendations" 
ON public.product_recommendations 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates on plants
CREATE TRIGGER update_plants_updated_at
  BEFORE UPDATE ON public.plants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample product recommendations
INSERT INTO public.product_recommendations (category, product_name, description, price_range, product_link, rating) VALUES
('Pupuk', 'Pupuk NPK Daun Hijau', 'Pupuk lengkap untuk pertumbuhan optimal tanaman hias', 'Rp 15.000 - 25.000', 'https://example.com/pupuk-npk', 4.5),
('Pupuk', 'Pupuk Kompos Organik', 'Pupuk organik ramah lingkungan untuk tanaman indoor', 'Rp 20.000 - 35.000', 'https://example.com/pupuk-organik', 4.7),
('Alat', 'Sprayer Mini 500ml', 'Semprotan air praktis untuk tanaman kecil', 'Rp 25.000 - 40.000', 'https://example.com/sprayer', 4.3),
('Alat', 'Sekop Mini Set', 'Set alat berkebun mini untuk pot tanaman', 'Rp 30.000 - 50.000', 'https://example.com/sekop-set', 4.6),
('Media Tanam', 'Tanah Humus Premium', 'Media tanam berkualitas tinggi untuk tanaman hias', 'Rp 10.000 - 20.000', 'https://example.com/tanah-humus', 4.4),
('Media Tanam', 'Sekam Bakar', 'Media tanam untuk drainase dan aerasi yang baik', 'Rp 8.000 - 15.000', 'https://example.com/sekam-bakar', 4.2);